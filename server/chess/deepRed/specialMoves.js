const basic = require('./basic');
const movesWhite = require('./movesWhite');
const movesBlack = require('./movesBlack');
const attacksWhite = require('./attacksWhite');
const attacksBlack = require('./attacksBlack');

const { mutateBoard } = basic;
const { getAllMovesWhite } = movesWhite;
const { getAllMovesBlack } = movesBlack;
const { whiteIsChecked } = attacksBlack;
const { blackIsChecked } = attacksWhite;

const getAllMovesWithSpecialWhite = (board, pieceState) => {
  const moves = getAllMovesWhite(board);
  const specialMoves = [];

  // ******* Castling
  // King can not castle out of check
  if (pieceState && !pieceState.hasMovedWK && !whiteIsChecked(board) &&
    board[7][4] === 'WK' && board[7][7] === 'WR' && board[7][0] === 'WR'
  ) {
    // King side castle
    if (!pieceState.hasMovedWKR &&
      !board[7][5] && !board[7][6] &&
      !whiteIsChecked(mutateBoard(board, ['74', '75'])) &&
      !whiteIsChecked(mutateBoard(board, ['74', '76']))
    ) {
      specialMoves.push('O-O');
    }
    // Queen side castle
    if (!pieceState.hasMovedWQR &&
      !board[7][3] && !board[7][2] && !board[7][1] &&
      !whiteIsChecked(mutateBoard(board, ['74', '73'])) &&
      !whiteIsChecked(mutateBoard(board, ['74', '72'])) &&
      !whiteIsChecked(mutateBoard(board, ['74', '71']))
    ) {
      specialMoves.push('O-O-O');
    }
  }

  // ******* En-passant
  if (pieceState && pieceState.canEnPassantW !== '') {
    const bp = pieceState.canEnPassantW;
    // from left
    if (bp[1] > 0 && board[3][+bp[1] - 1] === 'WP') {
      specialMoves.push({
        move: 'enpassant',
        from: `3${bp[1] - 1}`,
        to: `2${bp[1]}`,
        captured: `3${bp[1]}`,
      });
    }
    // from right
    if (bp[1] < 7 && board[3][+bp[1] + 1] === 'WP') {
      specialMoves.push({
        move: 'enpassant',
        from: `3${+bp[1] + 1}`,
        to: `2${+bp[1]}`,
        captured: `3${+bp[1]}`,
      });
    }
  }

  // ******* Pawn Promotion
  board[1].forEach((col, index) => {
    if (col === 'WP') {
      const newPieces = ['WQ', 'WR', 'WB', 'WN'];
      const move = {
        move: 'pawnPromotion',
        from: `1${index}`,
      };

      // advance 1
      if (!board[0][index]) {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `0${index}`, newPiece })));
      }

      // capture left
      if (index > 0 && board[0][index - 1] &&
        board[0][index - 1][0] === 'B') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `0${index - 1}`, newPiece })));
      }

      // capture right
      if (index < 7 && board[0][index + 1] &&
        board[0][index + 1][0] === 'B') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `0${index + 1}`, newPiece })));
      }
    }
  });

  if (specialMoves.length > 0) {
    moves.specialMoves = specialMoves;
  }

  return moves;
};

const getAllMovesWithSpecialBlack = (board, pieceState) => {
  const moves = getAllMovesBlack(board);

  const specialMoves = [];

  // Castling
  // King can not castle out of check
  if (pieceState && !pieceState.hasMovedBK && !blackIsChecked(board) &&
    board[0][4] === 'BK' && board[0][7] === 'BR' && board[0][0] === 'BR'
  ) {
    // King side castle
    if (!pieceState.hasMovedBKR &&
      !board[0][5] && !board[0][6] &&
      !blackIsChecked(mutateBoard(board, ['04', '05'])) &&
      !blackIsChecked(mutateBoard(board, ['04', '06']))
    ) {
      specialMoves.push('O-O');
    }
    if (!pieceState.hasMovedBQR &&
      !board[0][3] && !board[0][2] && !board[0][1] &&
      !blackIsChecked(mutateBoard(board, ['04', '03'])) &&
      !blackIsChecked(mutateBoard(board, ['04', '02']))
    ) {
      specialMoves.push('O-O-O');
    }
  }

  // ******* En-passant
  if (pieceState && pieceState.canEnPassantB !== '') {
    const wp = pieceState.canEnPassantB;
    // from left
    console.log(wp, pieceState);
    if (wp[1] > 0 && board[4][+wp[1] - 1] === 'BP') {
      specialMoves.push({
        move: 'enpassant',
        from: `4${wp[1] - 1}`,
        to: `5${wp[1]}`,
        captured: `4${wp[1]}`,
      });
    }
    // from right
    if (wp[1] < 7 && board[4][+wp[1] + 1] === 'BP') {
      specialMoves.push({
        move: 'enpassant',
        from: `4${+wp[1] + 1}`,
        to: `5${+wp[1]}`,
        captured: `4${+wp[1]}`,
      });
    }
  }

  // ******* Pawn Promotion
  board[6].forEach((col, index) => {
    if (col === 'BP') {
      const newPieces = ['BQ', 'BR', 'BB', 'BN'];
      const move = {
        move: 'pawnPromotion',
        from: `6${index}`,
      };

      // advance 1
      if (!board[7][index]) {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `7${index}`, newPiece })));
      }

      // capture left
      if (index > 0 && board[7][index - 1] &&
        board[7][index - 1][0] === 'W') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `7${index - 1}`, newPiece })));
      }

      // capture right
      if (index < 7 && board[7][index + 1] &&
        board[7][index + 1][0] === 'W') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `7${index + 1}`, newPiece })));
      }
    }
  });

  if (specialMoves.length > 0) {
    moves.specialMoves = specialMoves;
  }

  return moves;
};

module.exports = {
  getAllMovesWithSpecialWhite,
  getAllMovesWithSpecialBlack,
};
