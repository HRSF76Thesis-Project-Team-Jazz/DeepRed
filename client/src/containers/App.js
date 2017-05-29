import React, { Component } from 'react';
import { connect } from 'react-redux';
import socket from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';

// Components
import ChessMenu from '../components/ChessMenu';
import SettingsDrawer from '../components/SettingsDrawer';
import Board from '../components/Board';
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
    axios.get('/api/profiles/')
    .then((response) => {
      console.log('successfully fetched current user infomation', response);
    })
    .catch((err) => {
      console.error('failed to obtain current user infomation!', err);
    });
  }

  checkLegalMove(originDestCoord) {
    console.log('sending origin and dest coordinates to server');
    this.io.emit('checkLegalMove', originDestCoord);
  }

  render() {
    const { moveHistory, capturedPiecesBlack, capturedPiecesWhite, board } = this.props;

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
              <CapturedPieces color="Black" capturedPieces={capturedPiecesBlack} />
              <Board checkLegalMove={this.checkLegalMove} board={board} />
              <CapturedPieces color="White" capturedPieces={capturedPiecesWhite} />
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
  const { gameState, boardState } = state;
  const {
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  } = gameState;
  const { board } = boardState;
  return {
    board,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
  };
}

export default connect(mapStateToProps)(App);
