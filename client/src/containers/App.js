import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { pauseDialogOpen, pauseDialogClose, setPlayerW, updateRoomInfo, getRequestFailure, receiveGame, movePiece, unselectPiece, capturePiece, displayError, colorSquare } from '../store/actions';

// Components
import ChessMenu from '../components/ChessMenu';
import SettingsDrawer from '../components/SettingsDrawer';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import Alert from './Alert';
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
    this.onRejectPauseRequest = this.onRejectPauseRequest.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
    .then((response) => {
      console.log('successfully fetched current user infomation');
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
    const { dispatch, playerW } = this.props;

    const name = playerW;
    // instantiate socket instance on the cllient side
    this.socket = io.connect();

    this.socket.on('connect', () => {
      console.log('client side connected!');
      this.socket.emit('sendCurrentUserName', name);
    });

    this.socket.on('firstPlayerJoined', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      console.log(`first player has joined ${roomInfo.room} as ${roomInfo.playerW} with socket id ${roomInfo.playerWid}`);
      console.log(`first player local socket id is: ${this.socket.id}`);
    });

    this.socket.on('secondPlayerJoined', (roomInfo) => {
      console.log(`second player has joined ${roomInfo.room} as ${roomInfo.playerB} with socket id ${roomInfo.playerBid}`);
      console.log(`second player local socket id is: ${this.socket.id}`);
    });

    this.socket.on('startGame', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
    });

    this.socket.on('attemptMoveResult', (board, error, selectedPiece, origin, dest, selection, room) => {
      console.log('************** BOARD: ', board);
      // dispatch(receiveGame(board));
      if (error === null) {
        dispatch(movePiece(selectedPiece, origin, dest));
        if (selection) {
          dispatch(capturePiece(selectedPiece, origin, dest, selection));
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
      const { room, playerB, playerW } = this.props;
      console.log('notification received');
      this.socket.emit('handleRejectPauseRequest', room, playerB, playerW);
    });

    this.socket.on('cancelPauseNotification', () => {
      console.log('someone canceled pause');
    });
  }
  // CONTROL functions
  onRejectPauseRequest() {
    const { dispatch, room } = this.props;
    dispatch(pauseDialogClose());
    this.socket.emit('rejectPauseRequest', room);
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

  attemptMove(selectedPiece, origin, dest, selection, room) {
    // const { dispatch } = this.props;
    console.log('sending origin and dest coordinates to server');
    this.socket.emit('attemptMove', selectedPiece, origin, dest, selection, room);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  checkLegalMove(origin, dest, room) {
    // const { dispatch } = this.props;
    console.log('checking legal move');

    this.socket.emit('checkLegalMove', origin, dest, room);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  render() {
    const { pauseOpen, moveHistory, capturedPiecesBlack, capturedPiecesWhite, message, playerB, playerW, error } = this.props;
    const pauseActions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={this.onRejectPauseRequest}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handlePauseClose}
      />,
    ];
    const cancelPauseOpen = false;
    const cancelPauseActions = [
      <FlatButton
        label="No"
        primary={true}
        onTouchTap={this.onRejectPauseRequest}
      />,
      <FlatButton
        label="Yes"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handlePauseClose}
      />,
    ]
    return (
      <div className="site-wrap">
        <ChessMenu />
        <div className="header">
          <table>
            <tbody>
              <tr>
                <td><h1>Deep Red</h1></td>
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
                color="Black"
                capturedPieces={capturedPiecesBlack}
                player={playerB}
                sendPauseRequest={this.sendPauseRequest}
              />
              <Board attemptMove={this.attemptMove} checkLegalMove={this.checkLegalMove} />
              <CapturedPieces
                color="White"
                capturedPieces={capturedPiecesWhite}
                player={playerW}
                sendPauseRequest={this.sendPauseRequest}
              />
              <Message message={message} />
              <Message message={error} />
            </div>

            <div className="flex-col right-col">
              <MoveHistory moveHistory={moveHistory} />
            </div>

            <div>
              <Alert 
                title="Would you like to pause this game?" 
                actions={pauseActions} 
                open={pauseOpen} 
                handleClose={this.handlePauseClose} 
              />
              <Alert
                title="Pause request has been canceled"
                actions={cancelPauseActions}
                open={cancelPauseOpen}
                handleClose={this.handlePauseClose}
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
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  } = gameState;
  const {
    playerW,
    playerB,
    room,
  } = userState;
  const { message, error } = moveState;
  const { pauseOpen } = controlState;
  return {
    pauseOpen,
    room,
    playerB,
    playerW,
    message,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    error,
  };
}

export default connect(mapStateToProps)(App);
