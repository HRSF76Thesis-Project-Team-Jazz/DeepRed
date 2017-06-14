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

  onClick(dest) {
    const {
      dispatch, board, origin, selectedPiece, room, gameTurn,
      isWhite, attemptMove, checkLegalMoves, boolBoard, gameMode,
      conversation, renderError,
    } = this.props;

    if ((isWhite && gameTurn === 'B') || (!isWhite && gameTurn === 'W')) {
      // dispatch(displayError('Not your turn.'));
      // conversation('Not your turn.');
      renderError('Not your turn.');
    } else {
      const selection = board[dest[0]][dest[1]];
      console.log('SELECTION: ', selection);
      // If no piece is currently selected
      if (selectedPiece === '') {
        if (selection) {
          dispatch(selectPiece(selection, dest));
          dispatch(colorSquare('board-col green', dest));
          dispatch(displayError(''));
          checkLegalMoves(dest, room);
        } else {
          dispatch(invalidSelection(dest));
        }
      } else if (selectedPiece === 'WP' && dest[0] === 0 && boolBoard[dest[0]][dest[1]]) {
        dispatch(openPromotionDialog(dest));
      } else if (selectedPiece === 'BP' && dest[0] === 7 && boolBoard[dest[0]][dest[1]]) {
        dispatch(openPromotionDialog(dest));
      } else {
        attemptMove(origin, dest, selection, room, null, gameMode);
      }
    }
  }

  onMouseEnter(dest) {
    const { dispatch, selectedPiece, boolBoard } = this.props;
    if (selectedPiece) {
      const bool = boolBoard[dest[0]][dest[1]];
      let color = 'board-col red';
      if (bool) {
        color = 'board-col green';
      }
      dispatch(colorSquare(color, dest));
    }
  }

  onMouseLeave(dest) {
    const { dispatch, origin } = this.props;
    if (origin) {
      if (origin[0] !== dest[0] && origin[1] !== dest[1]) {
        if ((dest[0] + dest[1]) % 2 === 1) {
          dispatch(colorSquare('board-col dark', dest));
        } else {
          dispatch(colorSquare('board-col dark', dest));
        }
      }
    }
  }

  handlePromotion(pawnPromoteType) {
    const { dispatch, board, attemptMove, origin, pawnPromotionCoord, room, gameMode } = this.props;
    const selection = board[pawnPromotionCoord[0]][pawnPromotionCoord[1]];
    attemptMove(origin, pawnPromotionCoord, selection, room, pawnPromoteType, gameMode);
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
    const { color, hover, origin } = this.props;
    if ((color && hover[0] === rowIndex && hover[1] === colIndex) ||
    (origin && (origin[0] === rowIndex && origin[1] === colIndex))) {
      return color;
    } else if ((rowIndex + colIndex) % 2 === 1) {
      return 'board-col dark';
    }
    return 'board-col light';
  }

  render() {
    const { board, isWhite, showPromotionDialog, winner, playerInCheck,
      showCheckDialog, showWinnerDialog, playerW, playerB } = this.props;
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
        {/* <Alert
          className="pauseRequest"
          title={`${playerInCheck} is in check.`}
          actions={checkActions}
          open={showCheckDialog}
        /> */}
        <Alert
          className="pauseRequest"
          title={`${winner} is the Chess Master!!`}
          actions={winnerActions}
          open={showWinnerDialog}
        />
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
