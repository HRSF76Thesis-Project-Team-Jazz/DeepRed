const safeMoves = require('./deepRed/safeMoves');
const basic = require('./deepRed/basic');
const chessEncode = require('./chessEncode');
const pieceState = require('./pieceState');

const {
  encodeWithState,
  decodeWithState,
} = chessEncode;

const { mutateBoard } = basic;

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const { evalPieceState } = pieceState;

const pieceScore = (board) => {
  const whitePieces = [];
  const blackPieces = [];

  board.forEach(row =>
  row.forEach(col =>
    ((col && col[0] === 'W') ? whitePieces.push(col) : blackPieces.push(col))));

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
  console.log(value);
  console.log(pieces);
  console.log(piecesKey);

  for (let i = 0; i < piecesKey.length; i += 1) {
    score += value[pieces[piecesKey[i]][1]];
  }
  return score;
};

module.exports = {
  pieceScore,
  boardPiecesScore,
};

const state = {
  hasMovedWK: false,
  hasMovedWKR: false,
  hasMovedWQR: false,
  hasMovedBK: false,
  hasMovedBKR: false,
  hasMovedBQR: false,
  canEnPassantW: '',
  canEnPassantB: '',
};

const board = [
  ['BR', 'BN', 'BB', null, 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, 'WP', null, null, null, null],
  [null, null, null, 'BQ', null, null, null, null],
  [null, null, null, null, null, null, null, 'BB'],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

console.log(piecesAttacked(board, state, 'W'));
