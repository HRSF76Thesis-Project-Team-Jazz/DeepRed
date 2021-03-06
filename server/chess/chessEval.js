const safeMoves = require('./deepRed/safeMoves');

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const pieceScore = (board) => {
  const whitePieces = [];
  const blackPieces = [];

  board.forEach(row =>
  row.forEach(col =>
    ((col && col[0] === 'W') ? whitePieces.push(col) : (col) ? blackPieces.push(col) : null)));

  const isEndGame = (whitePieces.length + blackPieces.length) < 12;

  return {
    P: (!isEndGame) ? 2 : 3.75,
    N: 9.25,
    B: 9.75,
    R: 15,
    Q: 23.75,
    K: (!isEndGame) ? 2 : 6.5,
  };
};

/**
 * Return the value of each player's pieces on the board
 * @param {array} board
 * @return {object} { whiteScore, blackScore }
 */

const boardPiecesScore = (board) => {
  const whitePieces = [];
  const blackPieces = [];

  board.forEach(row =>
  row.forEach(col =>
      ((col && col[0] === 'W') ? whitePieces.push(col) : blackPieces.push(col))));

  const value = pieceScore(board);

  let whiteScore = 0;
  let blackScore = 0;

  whitePieces.forEach((piece) => { piece ? whiteScore += value[piece[1]] : null; });
  blackPieces.forEach((piece) => { piece ? blackScore += value[piece[1]] : null; });

  return {
    whiteScore,
    blackScore,
  };
};

const piecesAttacked = (board, state, color) => {
  const moves = (color === 'W') ? getSafeMovesBlack(board, state) : getSafeMovesWhite(board, state);
  const keys = Object.keys(moves).filter(x => x !== 'specialMoves');
  const moveCoordinates = [];
  const pieces = {};
  const value = pieceScore(board);
  let score = 0;

  for (let i = 0; i < keys.length; i += 1) {
    moves[keys[i]].forEach(dest => moveCoordinates.push(dest));
  }

  if (moves.specialMoves) {
    moves.specialMoves.forEach(move => ((move.to) ? moveCoordinates.push(move.to) : null));
  }

  moveCoordinates.forEach((dest) => {
    if (board[dest[0]][dest[1]] &&
      board[dest[0]][dest[1]][0] === color) pieces[dest] = board[dest[0]][dest[1]];
  });

  const piecesKey = Object.keys(pieces);

  for (let i = 0; i < piecesKey.length; i += 1) {
    score += value[pieces[piecesKey[i]][1]];
  }

  return score;
};

module.exports = {
  pieceScore,
  boardPiecesScore,
  piecesAttacked,
};
