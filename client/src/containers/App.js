import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  updateTimer, pauseTimer, cancelPauseDialogClose, updateAlertName,
  cancelPauseDialogOpen, pauseDialogOpen, pauseDialogClose, setPlayerW,
  updateRoomInfo, getRequestFailure, receiveGame, movePiece, unselectPiece,
  capturePiece, displayError, colorSquare, sendMsg,
} from '../store/actions';

// Components
import SettingsDrawer from '../components/SettingsDrawer';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import Alert from './Alert';
import ChatBox from '../components/ChatBox';
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
    this.checkLegalMove = this.checkLegalMove.bind(this);
    this.newChessGame = this.newChessGame.bind(this);
    this.startSocket = this.startSocket.bind(this);
    this.sendPauseRequest = this.sendPauseRequest.bind(this);
    this.handlePauseOpen = this.handlePauseOpen.bind(this);
    this.handlePauseClose = this.handlePauseClose.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onCancelPauseRequest = this.onCancelPauseRequest.bind(this);
    this.handleCancelPauseClose = this.handleCancelPauseClose.bind(this);
    this.onAgreePauseRequest = this.onAgreePauseRequest.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
      .then((response) => {
        console.log('successfully fetched current user infomation: ', response);
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
    const { dispatch, playerW, playerWemail } = this.props;

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
    });

    this.socket.on('message', (msg) => {
      dispatch(sendMsg(msg));
    });

    this.socket.on('attemptMoveResult', (error, origin, dest, selection, room) => {
      // dispatch(receiveGame(board));
      if (error === null) {
        if (selection) {
          dispatch(capturePiece(origin, dest, selection));
        } else {
          dispatch(movePiece(origin, dest));
        }
      } else {
        console.log('---------- ERROR: ', error);
        dispatch(displayError(error));
      }
      dispatch(unselectPiece());
      dispatch(colorSquare(null, dest));
    });

    this.socket.on('isLegalMoveResult', (dest, bool) => {
      // dispatch(receiveGame(board));
      let color = 'board-col red';
      if (bool) {
        color = 'board-col green';
      }
      dispatch(colorSquare(color, dest));
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
      dispatch(pauseTimer());
    });
  }
  // CONTROL functions
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
    const { room } = this.props;
    this.socket.emit('requestPause', room);
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

  checkLegalMove(origin, dest, room) {
    // const { dispatch } = this.props;
    console.log('checking legal move');
    this.socket.emit('checkLegalMove', origin, dest, room, this.socket.id);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  sendMessage(msg) {
    const { room } = this.props;
    this.socket.emit('message', msg, room);
  }

  render() {
    const {
      alertName, cancelPauseOpen, pauseOpen, moveHistory,
      capturedPiecesBlack, capturedPiecesWhite, message,
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
        <div className="header">
          <table>
            <tbody>
              <tr>
                <td><img className="banner-img" src={'/assets/deepRed-dark-bg.png'} alt={''} /></td>
                <td className="button-cell">
                  <SettingsDrawer />
                  <a href="/profile" className="button">Home</a>
                  <a href="/logout" className="button">Logout</a>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="content">
          <div className="flex-row">

            <div className="flex-col">
              <CapturedPieces
                color={(!isWhite) ? 'White' : 'Black'}
                capturedPieces={(!isWhite) ? capturedPiecesWhite : capturedPiecesBlack}
                player={(!isWhite) ? playerW : playerB}
                sendPauseRequest={this.sendPauseRequest}
              />
              <Board attemptMove={this.attemptMove} checkLegalMove={this.checkLegalMove} />
              <CapturedPieces
                color={(isWhite) ? 'White' : 'Black'}
                capturedPieces={(isWhite) ? capturedPiecesWhite : capturedPiecesBlack}
                player={(isWhite) ? playerW : playerB}
                sendPauseRequest={this.sendPauseRequest}
              />
              <Message message={message} />
              <Message message={error} />
            </div>

            <div className="flex-col right-col">
              <MoveHistory moveHistory={moveHistory} />
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
    timeB,
    timeW,
    paused,
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
    playerWemail,
    timeB,
    timeW,
    paused,
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
