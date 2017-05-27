import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import socket from 'socket.io-client';

// Components
import Board from './Board';
import CapturedPieces from './CapturedPieces';
import Clock from './Clock';
import MovesList from './MovesList';

// CSS
import './css/App.css';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.checkLegalMove = this.checkLegalMove.bind(this);
  }

  componentDidMount() {
    this.io = socket('http://localhost:3000');
    this.io.on('connect', () => {
      console.log('client side connected!');
    });
  }

  checkLegalMove(originDestCoord) {
    console.log('sending origin and dest coordinates to server');
      this.io.emit('checkLegalMove', originDestCoord);
  }

  render() {
    return (
      <div className="site-wrap">
        <div className="header">
          <table>
            <tbody>
              <tr>
                <td><h1>Deep Red</h1></td>
                <td className="button-cell">
                  <Link to="/settings">Settings</Link>
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
              <CapturedPieces color="Black" />
              <Board checkLegalMove={this.checkLegalMove} />
              <CapturedPieces color="White" />
            </div>

            <div className="flex-col right-col">
              <Clock />
              <MovesList />
              <Clock />
            </div>

          </div>
        </div>
      </div>
    );
  }

}

export default App;
