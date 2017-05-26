import React, { Component } from 'react';

import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount() {
  }

  render() {
    const board = [...Array(8).keys()];

    return (
      <div className="board">
        {board.map((x) => {
          return <div key={x} className="board-row">
            {board.map(y => <div className={((x+y) % 2 === 0) ? 'board-col dark': 'board-col light' }  key={x.toString() + y.toString()}>
            </div>)} </div>;
        })}
      </div>
    );
  }

}

export default Board;
