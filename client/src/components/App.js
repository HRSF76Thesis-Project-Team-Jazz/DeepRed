import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import io from 'socket.io-client';

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
  }

  componentDidMount() {
    const socket = io('https://localhost:3000');
    socket.on('connect', () => {
      console.log('client side socket is connected!');
    });
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
              <Board />
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
