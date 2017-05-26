import React, { Component } from 'react';
import { Link } from 'react-router-dom';

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
  }

  render() {
    return (
      <div className="site-wrap">
        <div className="header">
          <h1>Deep Red</h1>
          <Link to="/settings">Settings</Link>
        </div>
        <div className="content">
          <div className="flex-row">

            <div className="flex-col">
              <CapturedPieces color="Black" />
              <Board />
              <CapturedPieces color="White" />
            </div>

            <div className="flex-col">
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
