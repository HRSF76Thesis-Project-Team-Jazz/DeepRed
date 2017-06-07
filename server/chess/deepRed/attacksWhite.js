const basic = require('./basic');
const movesWhite = require('./movesWhite');

const { findPiecePosition } = basic;
const { getAllMovesWhite } = movesWhite;

/**
 * Input board, return if BK is in check
 * @param {array} board
 * @return {boolean}
 */

const blackIsChecked = (board) => {
  const whiteMoves = getAllMovesWhite(board);
  const positionBK = JSON.stringify(findPiecePosition('BK', board)[0]);
  const keys = Object.keys(whiteMoves);
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] !== 'specialMoves') {
      if (whiteMoves[keys[i]].map(x => JSON.stringify(x)).indexOf(positionBK) >= 0) {
        return true;
      }
    }
  }
  return false;
};

const piecesAttackedByWhite = (board) => {
  const whiteMoves = getAllMovesWhite(board);
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
  const keys = Object.keys(whiteMoves);
  for (let i = 0; i < keys.length; i += 1) {
    whiteMoves[keys[i]].forEach((xy) => {
      const x = xy[0];
      const y = xy[1];
      if (board[x][y]) result[x][y] = 1;
    });
  }
  return result;
};

module.exports = {
  blackIsChecked,
  piecesAttackedByWhite,
};
