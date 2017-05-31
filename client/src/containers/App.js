import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import { getRequestSuccess, getRequestFailure, getUserProfile } from '../store/actions';

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
    this.state = {
    };
    this.getUserInfo = this.getUserInfo.bind(this);
    this.checkLegalMove = this.checkLegalMove.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
    this.io = socket.connect();
    this.io.on('connect', () => {
      console.log('client side connected!');
    });
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
    .then((response) => {
      console.log('successfully fetched current user infomation', response);
      dispatch(getRequestSuccess(response));
    })
    .catch((err) => {
      dispatch(getRequestFailure(err));
      console.error('failed to obtain current user infomation!', err);
    });
  }

  checkLegalMove(originDestCoord) {
    console.log('sending origin and dest coordinates to server');
    this.io.emit('checkLegalMove', originDestCoord);
  }

  render() {
    const { moveHistory, capturedPiecesBlack, capturedPiecesWhite, message, playerB, playerW } = this.props;

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
