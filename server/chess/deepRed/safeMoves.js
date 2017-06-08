const basic = require('./basic');
const movesWhite = require('./movesWhite');
const movesBlack = require('./movesBlack');
const attacksBlack = require('./attacksBlack');
const attacksWhite = require('./attacksWhite');

const { mutateBoard } = basic;
const { getAllMovesWhite } = movesWhite;
const { getAllMovesBlack } = movesBlack;
const { whiteIsChecked } = attacksBlack;
const { blackIsChecked } = attacksWhite;

const getSafeMovesWhite = (board, pieceState) => {
  const moves = getAllMovesWhite(board, pieceState);
  const result = (moves.specialMoves) ?
    { specialMoves: moves.specialMoves } : {};
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
  const moves = getAllMovesBlack(board, pieceState);
  const result = (moves.specialMoves) ?
    { specialMoves: moves.specialMoves } : {};
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
