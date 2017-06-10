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
    this.onClick = this.onClick.bind(this);
    this.handlePromotion = this.handlePromotion.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.selectSquareClass = this.selectSquareClass.bind(this);
    this.handleCloseCheckDialog = this.handleCloseCheckDialog.bind(this);
    this.handleCloseWinnerDialog = this.handleCloseWinnerDialog.bind(this);
  }

  onClick(coordinates) {
    const {
      dispatch, board, fromPosition, selectedPiece, room, gameTurn,
      isWhite, attemptMove, checkLegalMoves, boolBoard,
    } = this.props;

    if ((isWhite && gameTurn === 'B') || (!isWhite && gameTurn === 'W')) {
      dispatch(displayError('Not your turn.'));
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
      } else if (selectedPiece === 'WP' && coordinates[0] === 0 && boolBoard[coordinates[0]][coordinates[1]]) {
        dispatch(openPromotionDialog(coordinates));
      } else if (selectedPiece === 'BP' && coordinates[0] === 7 && boolBoard[coordinates[0]][coordinates[1]]) {
        dispatch(openPromotionDialog(coordinates));
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

  handlePromotion(pieceType) {
    const { dispatch, board, attemptMove, fromPosition, pawnPromotionCoord, room } = this.props;
    const selection = board[pawnPromotionCoord[0]][pawnPromotionCoord[1]];
    console.log(pieceType);
    attemptMove(fromPosition, pawnPromotionCoord, selection, room, pieceType);
    dispatch(closePromotionDialog());
  }

  handleCloseCheckDialog() {
    const { dispatch } = this.props;
    dispatch(closeCheckDialog());
  }

  handleCloseWinnerDialog() {
    const { dispatch } = this.props;
    dispatch(closeWinnerDialog());
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
    const { board, isWhite, showPromotionDialog, winner, playerInCheck, showCheckDialog, showWinnerDialog } = this.props;
    const offset = (isWhite) ? 0 : 7;

    const promotionActions = [
      <FlatButton
        label="Queen"
        primary
        onTouchTap={() => this.handlePromotion('Q')}
      />,
      <FlatButton
        label="Rook"
        primary
        keyboardFocused
        onTouchTap={() => this.handlePromotion('R')}
      />,
      <FlatButton
        label="Knight"
        primary
        keyboardFocused
        onTouchTap={() => this.handlePromotion('N')}
      />,
      <FlatButton
        label="Bishop"
        primary
        keyboardFocused
        onTouchTap={() => this.handlePromotion('B')}
      />,
    ];

    const checkActions = [
      <RaisedButton
        label="OK"
        secondary
        onTouchTap={this.handleCloseCheckDialog}
      />,
    ];

    const winnerActions = [
      <RaisedButton
        label="Ok"
        secondary
        onTouchTap={this.handleCloseWinnerDialog}
      />,
    ];

    return (
      <div>
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
        </div>
        <Alert
          className="pauseRequest"
          title="Please select an upgrade."
          actions={promotionActions}
          open={showPromotionDialog}
        />
        <Alert
          className="pauseRequest"
          title={`${playerInCheck} is in check.`}
          actions={checkActions}
          open={showCheckDialog}
        />
        <Alert
          className="pauseRequest"
          title={`Winner is ${winner}!`}
          actions={winnerActions}
          open={showWinnerDialog}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, boardState, moveState, userState, squareState } = state;
  const { playerColor, gameTurn, playerInCheck, winner, showCheckDialog, showWinnerDialog } = gameState;
  const { board } = boardState;
  const { fromPosition, selectedPiece, boolBoard, pawnPromotionCoord,
    showPromotionDialog } = moveState;
  const { room, isWhite } = userState;
  const { color, hover } = squareState;
  return {
    playerColor,
    board,
    fromPosition,
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
  };
}

export default connect(mapStateToProps)(Board);
