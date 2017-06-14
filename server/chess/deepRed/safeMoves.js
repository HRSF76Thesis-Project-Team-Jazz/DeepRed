const basic = require('./basic');
const attacksBlack = require('./attacksBlack');
const attacksWhite = require('./attacksWhite');
const specialMoves = require('./specialMoves');
const chessEncode = require('../chessEncode');
const pieceState = require('../pieceState');

const { mutateBoard } = basic;
const { whiteIsChecked } = attacksBlack;
const { blackIsChecked } = attacksWhite;
const { getAllMovesWithSpecialWhite, getAllMovesWithSpecialBlack } = specialMoves;
const {
  encodeWithState,
} = chessEncode;
const { evalPieceState } = pieceState;

const getSafeMovesWhite = (board, state) => {
  const moves = getAllMovesWithSpecialWhite(board, state);
  const result = {};

  if (moves.specialMoves) {
    const newSpecialMoves = [];
    moves.specialMoves.forEach(move =>
      !whiteIsChecked(mutateBoard(board, move)) && newSpecialMoves.push(move));
    (newSpecialMoves.length > 0) && (result.specialMoves = newSpecialMoves);
  }

  const pieces = Object.keys(moves).filter(x => x !== 'specialMoves');
  for (let i = 0; i < pieces.length; i += 1) {
    result[pieces[i]] = [];
    moves[pieces[i]].forEach((move) => {
      !whiteIsChecked(mutateBoard(board, [pieces[i], [move[0], move[1]]])) &&
        result[pieces[i]].push(move);
    });
  }
  return result;
};

const getSafeMovesBlack = (board, state) => {
  const moves = getAllMovesWithSpecialBlack(board, state);
  const result = {};

  if (moves.specialMoves) {
    const newSpecialMoves = [];
    moves.specialMoves.forEach(move =>
      !blackIsChecked(mutateBoard(board, move)) && newSpecialMoves.push(move));
    (newSpecialMoves.length > 0) && (result.specialMoves = newSpecialMoves);
  }

  const pieces = Object.keys(moves).filter(x => x !== 'specialMoves');

  for (let i = 0; i < pieces.length; i += 1) {
    result[pieces[i]] = [];
    moves[pieces[i]].forEach((move) => {
      !blackIsChecked(mutateBoard(board, [pieces[i], [move[0], move[1]]])) &&
        result[pieces[i]].push(move);
    });
  }
  return result;
};

const getEncodedSafeMoves = (board, state, color) => {
  const encodedMoves = [];
  const moves = (color === 'W') ? getSafeMovesWhite(board, state) : getSafeMovesBlack(board, state);

  const keys = Object.keys(moves).filter(x => x !== 'specialMoves');

  for (let i = 0; i < keys.length; i += 1) {
    moves[keys[i]].forEach((dest) => {
      const move = [keys[i], dest];
      const newBoard = mutateBoard(board, move);
      const newState = evalPieceState(board, move, color, state);
      encodedMoves.push(encodeWithState(newBoard, newState));
    });
  }

  if (moves.specialMoves) {
    moves.specialMoves.forEach((move) => {
      const newBoard = mutateBoard(board, move);
      const newState = evalPieceState(board, move, color, state);
      encodedMoves.push(encodeWithState(newBoard, newState));
    });
  }

  return encodedMoves;
};

module.exports = {
  getSafeMovesWhite,
  getSafeMovesBlack,
  getEncodedSafeMoves,
};
