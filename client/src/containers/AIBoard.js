import React, { Component } from 'react';
import { connect } from 'react-redux';

import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.selectSquareClass = this.selectSquareClass.bind(this);
  }

  selectSquareClass(rowIndex, colIndex) {
    if ((rowIndex + colIndex) % 2 === 1) {
      return 'board-col dark';
    }
    return 'board-col light';
  }

  render() {
    const { board } = this.props;
    return (
      <div>
        <div className="board">
          {board.map((row, rowIndex) => (
            <div key={Math.random()} className="board-row">
              {row.map((col, colIndex) => (
                <div
                  className={this.selectSquareClass(Math.abs(rowIndex),
                    Math.abs(colIndex))}
                  key={(Math.abs(rowIndex)).toString() +
                     (Math.abs(colIndex)).toString()}
                  role={'button'}
                >
                  <img className="piece-img" src={`/assets/${board[Math.abs(rowIndex)][Math.abs(colIndex)]}.png`} alt={''} />
                </div>),
              )}
            </div>
          ),
          )}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { boardState } = state;
  const { board } = boardState;
  return { board };
}

export default connect(mapStateToProps)(Board);
