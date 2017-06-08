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
  const positionWK = findPiecePosition('WK', board)[0];

  if (positionWK) {
    const row = positionWK[0];
    const col = positionWK[1];
    if (row === 7) {
      if (col > 0 && board[6][col - 1] === 'BP') return true;
      if (col < 7 && board[6][col + 1] === 'BP') return true;
    }
  }

  const positionWKstring = JSON.stringify(positionWK);
  const keys = Object.keys(blackMoves);
  for (let i = 0; i < keys.length; i += 1) {
    if (keys[i] !== 'specialMoves' &&
      blackMoves[keys[i]].map(x => JSON.stringify(x)).indexOf(positionWKstring) >= 0) return true;
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
