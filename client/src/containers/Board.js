import React, { Component } from 'react';
import { connect } from 'react-redux';

import { invalidSelection, selectPiece, colorSquare, displayError } from '../store/actions';
import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.selectSquareClass = this.selectSquareClass.bind(this);
  }

  componentDidMount() {
  }

  onClick(coordinates) {
    const {
      dispatch, board, fromPosition, selectedPiece, room, gameTurn,
      isWhite, attemptMove, checkLegalMoves,
    } = this.props;

    if ((isWhite && gameTurn === 'B') || (!isWhite && gameTurn === 'W')) {
      dispatch(displayError('Not your turn'));
    } else {
      const x = coordinates[0];
      const y = coordinates[1];
      const selection = board[x][y];
      console.log('SELECTION: ', selection);
      // If no piece is currently selected
      if (selectedPiece === '') {
        if (selection) {
          dispatch(selectPiece(selection, coordinates));
          dispatch(colorSquare('board-col green', coordinates));
          dispatch(displayError(''));
          checkLegalMoves(coordinates, room);
        } else {
          dispatch(invalidSelection(coordinates));
        }
      } else {
        attemptMove(fromPosition, coordinates, selection, room);
      }
    }
  }

  onMouseEnter(coordinates) {
    const { dispatch, selectedPiece, boolBoard } = this.props;
    if (selectedPiece) {
      const bool = boolBoard[coordinates[0]][coordinates[1]];
      let color = 'board-col red';
      if (bool) {
        color = 'board-col green';
      }
      dispatch(colorSquare(color, coordinates));
    }
  }

  onMouseLeave(coordinates) {
    const { dispatch, fromPosition } = this.props;
    if (fromPosition) {
      if (fromPosition[0] !== coordinates[0] && fromPosition[1] !== coordinates[1]) {
        if ((coordinates[0] + coordinates[1]) % 2 === 1) {
          dispatch(colorSquare('board-col dark', coordinates));
        } else {
          dispatch(colorSquare('board-col dark', coordinates));
        }
      }
    }
  }

  selectSquareClass(rowIndex, colIndex) {
    const { color, hover, fromPosition } = this.props;
    if ((color && hover[0] === rowIndex && hover[1] === colIndex) ||
    (fromPosition && (fromPosition[0] === rowIndex && fromPosition[1] === colIndex))) {
      return color;
    } else if ((rowIndex + colIndex) % 2 === 1) {
      return 'board-col dark';
    }
    return 'board-col light';
  }

  render() {
    const { board, isWhite } = this.props;
    const offset = (isWhite) ? 0 : 7;

    return (
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={Math.random()} className="board-row">
            {row.map((col, colIndex) => (
              <div
                className={this.selectSquareClass(Math.abs(offset - rowIndex),
                  Math.abs(offset - colIndex))}
                key={(Math.abs(offset - rowIndex)).toString() +
                   (Math.abs(offset - colIndex)).toString()}
                role={'button'}
                onClick={() => this.onClick([(Math.abs(offset - rowIndex)),
                   (Math.abs(offset - colIndex))])}
                onMouseEnter={() => this.onMouseEnter([(Math.abs(offset - rowIndex)),
                  (Math.abs(offset - colIndex))])}
                onMouseLeave={() => this.onMouseLeave([(Math.abs(offset - rowIndex)),
                  (Math.abs(offset - colIndex))])}
              >
                <img className="piece-img" src={`/assets/${board[Math.abs(offset - rowIndex)][Math.abs(offset - colIndex)]}.png`} alt={''} />
              </div>),
            )}
          </div>
        ),
        )}
        {/*{board.map((row, rowIndex) => (
          <div key={Math.random()} className="board-row">
            {row.map((col, colIndex) => (
              <div
                className={this.selectSquareClass(rowIndex, colIndex)}
                key={rowIndex.toString() + colIndex.toString()}
                role={'button'}
                onClick={() => this.onClick([rowIndex, colIndex])}
                onMouseEnter={() => this.onMouseEnter([rowIndex, colIndex])}
                onMouseLeave={() => this.onMouseLeave([rowIndex, colIndex])}
              >
                <img className="piece-img" src={`/assets/${col}.png`} alt={''} />
              </div>),
            )}
          </div>
        ),
        )}*/}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, boardState, moveState, userState, squareState } = state;
  const { playerColor, gameTurn } = gameState;
  const { board } = boardState;
  const { fromPosition, selectedPiece, boolBoard } = moveState;
  const { room, isWhite } = userState;
  const { color, hover } = squareState;
  return {
    playerColor,
    board,
    fromPosition,
    selectedPiece,
    boolBoard,
    room,
    color,
    hover,
    isWhite,
    gameTurn,
  };
}

export default connect(mapStateToProps)(Board);
