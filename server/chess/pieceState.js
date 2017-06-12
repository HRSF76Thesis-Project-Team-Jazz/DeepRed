const evalPieceState = (board, move, color, pieceState) => {
  const newState = Object.assign({}, pieceState, { canEnPassantW: '', canEnPassantB: '' });

  if (!Array.isArray(move)) {
    if (move.move === 'castle') {
      if (color === 'W') {
        newState.hasMovedWK = true;
      } else {
        newState.hasMovedBK = true;
      }

      if (move.side === 'O-O') {
        if (color === 'W') {
          newState.hasMovedWKR = true;
        } else {
          newState.hasMovedBKR = true;
        }
      } else if (color === 'W') {
        newState.hasMovedWQR = true;
      } else {
        newState.hasMovedBQR = true;
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    const piece = board[row][col];

    if (piece[1] === 'K') {
      if (color === 'W') {
        newState.hasMovedWK = true;
      } else {
        newState.hasMovedBK = true;
      }
    }

    if (piece[1] === 'R') {
      if (move[0] === '00') {
        newState.hasMovedBQR = true;
      } else if (move[0] === '07') {
        newState.hasMovedBKR = true;
      } else if (move[0] === '70') {
        newState.hasMovedWQR = true;
      } else if (move[0] === '77') {
        newState.hasMovedWKR = true;
      }
    }

    if (piece[1] === 'P') {
      if (+row === 6 && +toRow === 4) {
        newState.canEnPassantB = `4${col}`;
      } else if (+row === 1 && +toRow === 3) {
        newState.canEnPassantW = `3${col}`;
      }
    }
  } // end of else | move = array

  return newState;
}; // end of evalPieceState

module.exports = {
  evalPieceState,
};
