const safeMoves = require('../deepRed/safeMoves');

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const whiteMove = (board, pieceState) => {
  const moves = getSafeMovesWhite(board, pieceState);
  const newState = pieceState;
  newState.moveCount += 1;

  let count = 0;
  const keys = Object.keys(moves);
  let move = {};

  for (let i = 0; i < keys.length; i += 1) {
    count += moves[keys[i]].length;
  }

  const choice = Math.floor(Math.random() * count);

  count = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if ((count + moves[keys[i]].length) > choice) {
      if (keys[i] !== 'specialMoves') {
        move = [keys[i], moves[keys[i]][choice - count]];
      } else {
        move = moves[keys[i]][choice - count];
      }
      break;
    }
    count += moves[keys[i]].length;
  }

  newState.canEnPassantB = '';

  if (!Array.isArray(move)) {
    if (move.move === 'castle') {
      newState.hasMovedWK = true;
      newState.castle += 1;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
    if (move.move === 'enpassant') {
      newState.lastCapture = newState.moveCount;
      newState.capturedWhite.push('BP');
      newState.countBlackPieces -= 1;
      newState.enPassant += 1;
    }
    if (move.move === 'pawnPromotion') {
      const row = move.to[0];
      const col = move.to[1];
      if (board[row][col]) {
        newState.countBlackPieces -= 1;
        newState.capturedWhite.push(board[row][col]);
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    const toCol = move[1][1];
    if (board[row][col][1] === 'P') newState.lastPawn = newState.moveCount;
    if (board[toRow][toCol]) {
      newState.lastCapture = newState.moveCount;
      newState.capturedWhite.push(board[toRow][toCol]);
      newState.countBlackPieces -= 1;
    }

    if (board[row][col] === 'WP' && +row === 6 && +toRow === 4) {
      newState.canEnPassantB = `4${col}`;
    }
  }

  return [move, newState];
};
