import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import { setPlayerW, setPlayerB, getRequestFailure, getUserProfile, updateRoomInfo } from '../store/actions';

// Components
import ChessMenu from '../components/ChessMenu';
import SettingsDrawer from '../components/SettingsDrawer';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import Clock from '../components/Clock';
import MoveHistory from '../components/MoveHistory';
import './css/App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
// CSS

class App extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.checkLegalMove = this.checkLegalMove.bind(this);
    this.startSocket = this.startSocket.bind(this);
  }

  componentWillMount() {
    const {dispatch, room, playerB, playerW} = this.props;
    this.socket = io.connect();
    this.getUserInfo();
    console.log('111: ', playerW);

  }

  componentDidMount() {
    const {dispatch, room, playerB, playerW} = this.props;
    this.startSocket();
  }

  startSocket() {
    const {dispatch, room, playerB, playerW} = this.props;
    console.log('222: ', playerW);
    this.socket.on('connect', () => {
      console.log('client side connected!');
    });

    this.socket.emit('sendUserInfo', playerW);
      
    this.socket.on('disconnect', () => {
      // this.socket.emit(roomInfo);
      console.log('client side disconnected!');
    });

    this.socket.on('playerLeft', () => {
      console.log('testing channel after player left');
    });

    this.socket.on('firstPlayerJoined', roomInfo => {
      console.log(`first player has joined ${roomInfo[0]} as ${roomInfo[1]}`);
    });

    this.socket.on('secondPlayerJoined', roomInfo => {
      console.log(`second player has joined ${roomInfo[0]} as ${roomInfo[2]}`);
    });

    this.socket.on('startGame', (roomInfo, newGame) => {
      dispatch(updateRoomInfo(roomInfo));
      // console.log('new game started: ', newGame);
      // console.log('inportant room information', roomInfo);
    });
  }

  getUserInfo() {
    const { dispatch, playerW, playerB} = this.props;
    axios.get('/api/profiles/id')
    .then((response) => {
      console.log('successfully fetched current user infomation');
      // console.log('playerW', playerW);
      // console.log('playerB', playerB);
      if (playerW === '') {
        dispatch(setPlayerW(response));
        this.socket.emit()
      } else {
        dispatch(setPlayerB(response));
      }
    })
    .catch((err) => {
      dispatch(getRequestFailure(err));
      console.error('failed to obtain current user infomation!', err);
    });
  }

  checkLegalMove(originDestCoord) {
    console.log('sending origin and dest coordinates to server');
    this.socket.emit('checkLegalMove', originDestCoord);
  }

  render() {
    const { moveHistory, capturedPiecesBlack, capturedPiecesWhite, message, playerB, playerW }
          = this.props;

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
              <CapturedPieces color="Black" capturedPieces={capturedPiecesBlack} player={playerB} />
              <Board checkLegalMove={this.checkLegalMove} />
              <CapturedPieces color="White" capturedPieces={capturedPiecesWhite} player={playerW} />
              <Message message={message} />
            </div>

            <div className="flex-col right-col">
              <Clock />
              <MoveHistory moveHistory={moveHistory} />
              <Clock />
            </div>

          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, moveState, userState } = state;
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
  const { message } = moveState;
  return {
    playerB,
    playerW,
    message,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  };
}

export default connect(mapStateToProps)(App);
