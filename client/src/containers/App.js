import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import {
  updateTimer, pauseTimer, cancelPauseDialogClose, updateAlertName,
  cancelPauseDialogOpen, pauseDialogOpen, pauseDialogClose, setPlayerW,
  updateRoomInfo, getRequestFailure, receiveGame, movePiece, resetBoolBoard,
  unselectPiece, capturePiece, displayError, colorSquare, sendMsg,
  updateTimerB, timeInstanceB, updateTimerW, timeInstanceW, saveBoolBoard, castlingMove,
} from '../store/actions';

// Components
import Header from '../components/Header';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import Alert from './Alert';
import ChatBox from '../components/ChatBox';
import PlayerName from '../components/PlayerName';
import Clock from '../components/Clock';
import './css/App.css';


// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
// CSS

class App extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.attemptMove = this.attemptMove.bind(this);
    this.checkLegalMoves = this.checkLegalMoves.bind(this);
    this.newChessGame = this.newChessGame.bind(this);
    this.startSocket = this.startSocket.bind(this);
    this.sendPauseRequest = this.sendPauseRequest.bind(this);
    this.handlePauseOpen = this.handlePauseOpen.bind(this);
    this.handlePauseClose = this.handlePauseClose.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onCancelPauseRequest = this.onCancelPauseRequest.bind(this);
    this.handleCancelPauseClose = this.handleCancelPauseClose.bind(this);
    this.onAgreePauseRequest = this.onAgreePauseRequest.bind(this);
    this.onChangePlayerTurn = this.onChangePlayerTurn.bind(this);
    this.decrementTimerB = this.decrementTimerB.bind(this);
    this.decrementTimerW = this.decrementTimerW.bind(this);
    this.stopTimerB = this.stopTimerB.bind(this);
    this.stopTimerW = this.stopTimerW.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
      .then((response) => {
        console.log('successfully fetched current user infomation: ');
        dispatch(setPlayerW(response));
      })
      .then(() => {
        this.startSocket();
      })
      .catch((err) => {
        dispatch(getRequestFailure(err));
        console.error('failed to obtain current user infomation!', err);
      });
  }

  startSocket() {
    const { dispatch, playerW, playerWemail, gameTurn } = this.props;

    const name = playerW;
    const email = playerWemail;
    // instantiate socket instance on the client side
    this.socket = io.connect();

    this.socket.on('connect', () => {
      console.log('client side socket connected!');
      this.socket.emit('sendCurrentUserNameAndEmail', name, email);
    });

    this.socket.on('firstPlayerJoined', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      console.log(`first player (White) has joined ${roomInfo.room} as ${roomInfo.playerW} with socket id ${roomInfo.playerWid}`);
      // console.log(`first player local socket id is: ${this.socket.id}`);
    });

    this.socket.on('secondPlayerJoined', (roomInfo) => {
      console.log(`second player (White) has joined ${roomInfo.room} as ${roomInfo.playerB} with socket id ${roomInfo.playerBid}`);
      // console.log(`second player local socket id is: ${this.socket.id}`);
    });

    this.socket.on('startGame', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      dispatch(updateTimer(roomInfo));
      this.decrementTimerW();
    });

    this.socket.on('message', (msg) => {
      dispatch(sendMsg(msg));
    });

    this.socket.on('attemptMoveResult', (error, origin, dest, selection, gameTurn, castling) => {
      // dispatch(receiveGame(board));
      if (error === null) {
        if (selection) {
          dispatch(capturePiece(origin, dest, selection, gameTurn));
          if (gameTurn === 'B') {
            this.onChangePlayerTurn();
            this.decrementTimerB();
          } else {
            this.onChangePlayerTurn();
            this.decrementTimerW();
          }
        } else if (castling) {
          dispatch(castlingMove(origin, dest, castling, gameTurn));
        } else {
          dispatch(movePiece(origin, dest, gameTurn));
          if (gameTurn === 'W') {
            this.onChangePlayerTurn();
            this.decrementTimerW();
          } else {
            this.onChangePlayerTurn();
            this.decrementTimerB();
          }
        }
      } else {
        console.log('---------- ERROR: ', error);
        dispatch(displayError(error));
      }
      dispatch(unselectPiece());
      dispatch(resetBoolBoard());
      dispatch(colorSquare(null, dest));
    });

    this.socket.on('checkLegalMovesResults', (boolBoard) => {
      dispatch(saveBoolBoard(boolBoard));
    });

    // CONTROL sockets
    this.socket.on('requestPauseDialogBox', () => {
      this.handlePauseOpen();
    });

    this.socket.on('rejectPauseRequestNotification', () => {
      const { room } = this.props;
      this.socket.emit('handleRejectPauseRequest', room, this.socket.id);
    });

    this.socket.on('cancelPauseNotification', (playerName) => {
      dispatch(updateAlertName(playerName));
      dispatch(cancelPauseDialogOpen());
      setTimeout(() => {
        dispatch(cancelPauseDialogClose());
        dispatch(pauseDialogClose());
      }, 3000);
    });

    this.socket.on('executePauseRequest', () => {
      // dispatch(pauseTimer());
    });

    this.socket.on('executeResumeRequest', () => {
      if (gameTurn === 'B') {
        this.onChangePlayerTurn();
        // dispatch(resumeTimerB());
      } else {
        this.onChangePlayerTurn();
        // dispatch(resumeTimerW());
      }
    });

    this.socket.on('sendUpdateTime', (roomInfo) => {
      dispatch(updateTimer(roomInfo));
    });
  }

  // CONTROL function
  decrementTimerB() {
    let { dispatch, timeB, counterBinstance } = this.props;
    counterBinstance = setInterval(() => {
      if (timeB > 0) {
        timeB -= 1;
      } else {
        timeB = 0;
        this.stopTimerB();
      }
      dispatch(updateTimerB(timeB));
      dispatch(timeInstanceB(counterBinstance));
    }, 1000);
  }

  decrementTimerW() {
    let { dispatch, timeW, counterWinstance } = this.props;
    counterWinstance = setInterval(() => {
      if (timeW > 0) {
        timeW -= 1;
      } else {
        timeW = 0;
        this.stopTimerW();
      }
      dispatch(updateTimerW(timeW));
      dispatch(timeInstanceW(counterWinstance));
    }, 1000);
  }

  stopTimerB() {
    const { dispatch, timeB, counterBinstance } = this.props;
    clearInterval(counterBinstance);
    dispatch(updateTimerB(timeB));
  }

  stopTimerW() {
    const { dispatch, timeW, counterWinstance } = this.props;
    clearInterval(counterWinstance);
    dispatch(updateTimerW(timeW));
  }

  onChangePlayerTurn() {
    const { room, timeB, timeW } = this.props;
    this.stopTimerB();
    this.stopTimerW();
    this.socket.emit('updateTime', room, timeB, timeW);
  }

  onAgreePauseRequest() {
    const { dispatch, room } = this.props;
    dispatch(pauseDialogClose());
    this.socket.emit('agreePauseRequest', room, this.socket.id);
  }

  onCancelPauseRequest() {
    const { dispatch, room } = this.props;
    dispatch(pauseDialogClose());
    this.socket.emit('rejectPauseRequest', room);
  }

  handleCancelPauseClose() {
    const { dispatch } = this.props;
    dispatch(pauseDialogClose());
    dispatch(cancelPauseDialogClose());
  }

  sendPauseRequest() {
    const { dispatch, room, pausedB, pausedW } = this.props;
    if (pausedB === true && pausedW === true) {
      this.socket.emit('requestResume', room);
    } else {
      this.socket.emit('requestPause', room);
    }
  }

  handlePauseOpen() {
    const { dispatch } = this.props;
    dispatch(pauseDialogOpen());
  }

  handlePauseClose() {
    const { dispatch } = this.props;
    dispatch(pauseDialogClose());
  }


  // LOGIC
  newChessGame() {
    const { dispatch } = this.props;
    console.log('make new game');
    this.socket.emit('newChessGame');
    this.socket.on('createdChessGame', game => dispatch(receiveGame(game)));
  }

  attemptMove(origin, dest, selection, room) {
    // const { dispatch, room} = this.props;
    console.log('sending origin and dest coordinates to server');
    this.socket.emit('attemptMove', origin, dest, selection, room, this.socket.id);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  checkLegalMoves(origin, room) {
    // const { dispatch } = this.props;
    console.log('checking legal moves');
    this.socket.emit('checkLegalMoves', origin, room, this.socket.id);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  sendMessage(msg) {
    const { room } = this.props;
    this.socket.emit('message', msg, room);
  }

  render() {
    const {
      alertName, cancelPauseOpen, pauseOpen, moveHistory,
      capturedPiecesBlack, capturedPiecesWhite,
      playerB, playerW, error, messages, isWhite,
    } = this.props;

    const pauseActions = [
      <FlatButton
        label="No"
        primary
        onTouchTap={this.onCancelPauseRequest}
      />,
      <FlatButton
        label="Yes"
        primary
        keyboardFocused
        onTouchTap={this.onAgreePauseRequest}
      />,
    ];

    const cancelPauseActions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.handleCancelPauseClose}
      />,
    ];

    return (
      <div className="site-wrap">
        <Header />
        <div className="content">
          <div className="flex-row">
            <div className="flex-col left-col">
               <div className="countdown-top-clock">
                {(playerB !== undefined) ?
                  <Clock color={(!isWhite) ? 'White' : 'Black'} sendPauseRequest={this.sendPauseRequest} stopTimeB={this.stopTimeB} /> : null
                }
              </div> 
              <PlayerName
                color={(!isWhite) ? 'White' : 'Black'}
                player={(!isWhite) ? playerW : playerB}
                position="top"
              />
              <MoveHistory
                moveHistory={moveHistory}
              />
              <PlayerName
                color={(isWhite) ? 'White' : 'Black'}
                player={(isWhite) ? playerW : playerB}
                position="bot"
              />
               <div className="countdown-bot-clock">
                {(playerB !== undefined) ?
                  <Clock color={(isWhite) ? 'White' : 'Black'} sendPauseRequest={this.sendPauseRequest} stopTimeB={this.stopTimeB} /> : null
                }
              </div> 
            </div>
            <div className="flex-col capt-col">
              <div className="flex-col capt-black-col">
                <CapturedPieces
                  color={(!isWhite) ? 'White' : 'Black'}
                  capturedPieces={(!isWhite) ? capturedPiecesWhite : capturedPiecesBlack}
                  player={(!isWhite) ? playerW : playerB}
                  sendPauseRequest={this.sendPauseRequest}
                />
              </div>
              <div className="flex-col capt-black-col">
                <CapturedPieces
                  color={(isWhite) ? 'White' : 'Black'}
                  capturedPieces={(isWhite) ? capturedPiecesWhite : capturedPiecesBlack}
                  player={(isWhite) ? playerW : playerB}
                  sendPauseRequest={this.sendPauseRequest}
                />
              </div>
            </div>
            <div className="flex-col">
              <Board attemptMove={this.attemptMove} checkLegalMoves={this.checkLegalMoves} />
              {/* <Message message={message} />
              <Message message={error} /> */}
            </div>

            <div className="flex-col right-col">
              <Message message={error} />
              <ChatBox messages={messages} sendMessage={this.sendMessage} />
            </div>

            <div>
              <Alert
                className="pauseRequest"
                title="Would you like to pause this game?"
                actions={pauseActions}
                open={pauseOpen}
                handleClose={this.handlePauseClose}
              />
              <Alert
                className="cancelPauseRequest"
                title={`Pause request has been canceled by ${alertName}`}
                actions={cancelPauseActions}
                open={cancelPauseOpen}
                handleClose={this.handleCancelPauseClose}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, moveState, userState, controlState } = state;
  const {
    counterBinstance,
    counterWinstance,
    timeB,
    timeW,
    // pausedB,
    // pausedW,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    messages,
  } = gameState;
  const {
    playerWemail,
    playerW,
    playerB,
    room,
    isWhite,
  } = userState;
  const { message, error } = moveState;
  const { pauseOpen, cancelPauseOpen, alertName } = controlState;
  return {
    counterBinstance,
    counterWinstance,
    playerWemail,
    timeB,
    timeW,
    // pausedB,
    // pausedW,
    alertName,
    cancelPauseOpen,
    pauseOpen,
    room,
    playerB,
    playerW,
    message,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    error,
    messages,
    isWhite,
  };
}

export default connect(mapStateToProps)(App);
