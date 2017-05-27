import React, { Component } from 'react';

import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      board: [
        ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
        ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
        ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
      ],
    };
  }

  componentDidMount() {
  }

  getImage(XY) {
    return <img className="piece-img" src={`/assets/${XY}.png`}></img>;
  }

  render() {
    const board = [...Array(8).keys()];

    return (
      <div className="board">
        {this.state.board.map((row, rowIndex) => {
          return (<div key={Math.random()} className="board-row">
            {row.map((col, colIndex) =>
              (<div
                className={((rowIndex + colIndex) % 2 === 0) ? 'board-col dark' : 'board-col light'}
                key={rowIndex.toString() + colIndex.toString()}
              >
                {(col) ? this.getImage(col) : ''}
              </div>),
            )}
          </div>);
        })}
      </div>
    );
  }

}

export default Board;
