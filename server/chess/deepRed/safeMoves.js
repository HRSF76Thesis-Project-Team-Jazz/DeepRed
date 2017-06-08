const basic = require('./basic');
const attacksBlack = require('./attacksBlack');
const attacksWhite = require('./attacksWhite');
const specialMoves = require('./specialMoves');


const { mutateBoard } = basic;
const { whiteIsChecked } = attacksBlack;
const { blackIsChecked } = attacksWhite;
const { getAllMovesWithSpecialWhite, getAllMovesWithSpecialBlack } = specialMoves;

const getSafeMovesWhite = (board, pieceState) => {
  const moves = getAllMovesWithSpecialWhite(board, pieceState);
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

const getSafeMovesBlack = (board, pieceState) => {
  const moves = getAllMovesWithSpecialBlack(board, pieceState);
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

module.exports = {
  getSafeMovesWhite,
  getSafeMovesBlack,
};
