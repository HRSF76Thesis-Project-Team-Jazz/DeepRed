const basic = require('./basic');
const movesBlack = require('./movesBlack');

const { findPiecePosition } = basic;
const { getAllMovesBlack } = movesBlack;

/**
 * Input board, return if WK is in check
 * @param {array} board
 * @return {boolean}
 */

const whiteIsChecked = (board) => {
  const blackMoves = getAllMovesBlack(board);
  const positionWK = JSON.stringify(findPiecePosition('WK', board)[0]);
  const keys = Object.keys(blackMoves);
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] !== 'specialMoves' &&
      blackMoves[keys[i]].map(x => JSON.stringify(x)).indexOf(positionWK) >= 0) return true;
  }
  return false;
};

const piecesAttackedByBlack = (board) => {
  const blackMoves = getAllMovesBlack(board);
  const result = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
  ];
  const keys = Object.keys(blackMoves);
  for (let i = 0; i < keys.length; i += 1) {
    blackMoves[keys[i]].forEach((xy) => {
      const x = xy[0];
      const y = xy[1];
      if (board[x][y]) result[x][y] = 1;
    });
  }
  return result;
};

module.exports = {
  whiteIsChecked,
  piecesAttackedByBlack,
};
