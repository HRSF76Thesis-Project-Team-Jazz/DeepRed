/**
 * Return new board after given move
 * @param {array} board
 * @param {array} move   [[0,0], [0,1]] or ['00', '01']
 */

const mutateBoard = (board, move) => {
  const result = board.map(row => row.map(x => x));
  result[move[1][0]][move[1][1]] = result[move[0][0]][move[0][1]];
  result[move[0][0]][move[0][1]] = null;
  return result;
};

/**
 * Return the positions for the input piece or input color
 * @param {string} piece   1) piece
 *                         2) 'W' or 'B': get all pieces of that color
 * @param {array} board
 * @return {array} : coordinates of piece [row, col]
 */

const findPiecePosition = (piece, board) => {
  const result = [];

  if (piece.length === 1) {
    const color = piece;
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (board[row][col] && board[row][col][0] === color) result.push([row, col]);
      }
    }
  } else if (piece[0] === 'B') {
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (board[row][col] === piece) result.push([row, col]);
      }
    }
  } else {
    for (let row = 7; row >= 0; row -= 1) {
      for (let col = 0; col < 8; col += 1) {
        if (board[row][col] === piece) result.push([row, col]);
      }
    }
  }
  return result;
};

module.exports = {
  mutateBoard,
  findPiecePosition,
};
