import React, { Component } from 'react';
import { connect } from 'react-redux';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';

import { invalidSelection, selectPiece, colorSquare, displayError, openPromotionDialog, closePromotionDialog, closeCheckDialog, closeWinnerDialog } from '../store/actions';

import Alert from './Alert';
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
  const { gameState, boardState, moveState, userState, squareState } = state;
  const { playerColor, gameTurn, playerInCheck, winner, showCheckDialog,
    showWinnerDialog, gameMode } = gameState;
  const { board } = boardState;
  const { origin, selectedPiece, boolBoard, pawnPromotionCoord,
    showPromotionDialog } = moveState;
  const { room, isWhite } = userState;
  const { color, hover } = squareState;
  return {
    playerColor,
    board,
    origin,
    selectedPiece,
    boolBoard,
    pawnPromotionCoord,
    showPromotionDialog,
    room,
    color,
    hover,
    isWhite,
    gameTurn,
    playerInCheck,
    winner,
    showCheckDialog,
    showWinnerDialog,
    gameMode,
  };
}

export default connect(mapStateToProps)(Board);
