import React, { Component } from 'react';
import { connect } from 'react-redux';

import { invalidSelection, selectPiece, colorSquare } from '../store/actions';
import './css/Board.css';

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.onClick = this.onClick.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.selectSquareClass = this.selectSquareClass.bind(this);
  }

  componentDidMount() {
    // const { dispatch } = this.props;
    // dispatch(fetchGame());
  }

  onClick(coordinates) {
    const { dispatch, board, fromPosition, selectedPiece, attemptMove, room } = this.props;

    const x = coordinates[0];
    const y = coordinates[1];
    const selection = board[x][y];
    console.log('SELECTION: ', selection);
    // If no piece is currently selected
    if (selectedPiece === '') {
      // && selection[0] === playerColor
      if (selection) {
        dispatch(selectPiece(selection, coordinates));
        dispatch(colorSquare('board-col green', coordinates));
      } else {
        dispatch(invalidSelection(coordinates));
      }
      // If a piece is already selected
      /* NOTE: CHECK FOR VALID MOVE REQUIRED HERE    */
      // if (selection === null)
    } else {
      attemptMove(fromPosition, coordinates, selection, room);
    // } else if (selectedPiece[0] === board[x][y][0]) {
    //   dispatch(invalidSelection(coordinates));
    // } else {
    //   const capturedPiece = selection;
    //   dispatch(capturePiece(selectedPiece, fromPosition, coordinates, capturedPiece));
    }
  }

  onMouseEnter(coordinates) {
    const { dispatch, fromPosition, selectedPiece, room, checkLegalMove } = this.props;
    if (selectedPiece) {
      checkLegalMove(fromPosition, coordinates, room);
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

    // if (selectedPiece) {
    //   checkLegalMove(fromPosition, coordinates, room);
    // }
  }

  selectSquareClass(rowIndex, colIndex) {
    const { color, hover, fromPosition } = this.props;
    if ((color && hover[0] === rowIndex && hover[1] === colIndex) || (fromPosition && (fromPosition[0] === rowIndex && fromPosition[1] === colIndex))) {
      return color;
    } else if ((rowIndex + colIndex) % 2 === 1) {
      return 'board-col dark';
    }
    return 'board-col light';
  }

  render() {
    const { board, color, hover, fromPosition } = this.props;
    return (
      <div className="board">
        {board.map((row, rowIndex) => (
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
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, boardState, moveState, userState, squareState } = state;
  const { playerColor } = gameState;
  const { board } = boardState;
  const { fromPosition, selectedPiece } = moveState;
  const { room } = userState;
  const { color, hover } = squareState;
  return {
    playerColor,
    board,
    fromPosition,
    selectedPiece,
    room,
    color,
    hover,
  };
}

export default connect(mapStateToProps)(Board);
