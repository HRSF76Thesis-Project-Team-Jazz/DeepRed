/**
 * Return new board after given move
 * @param {array} board
 * @param {array} move   [[0,0], [0,1]] or ['00', '01']
 */

const mutateBoard = (board, move) => {
  const newBoard = board.map(row => row.map(x => x));
  if (Array.isArray(move)) {
    newBoard[move[1][0]][move[1][1]] = newBoard[move[0][0]][move[0][1]];
    newBoard[move[0][0]][move[0][1]] = null;
  } else if (move.move === 'castle') {
    const color = move.color;
    const row = (color === 'W') ? 7 : 0;
    newBoard[row][4] = null;
    if (move.side === 'O-O') {
      newBoard[row][7] = null;
      newBoard[row][6] = `${color}K`;
      newBoard[row][5] = `${color}R`;
    } else {
      newBoard[row][0] = null;
      newBoard[row][2] = `${color}K`;
      newBoard[row][3] = `${color}R`;
    }
  } else if (move.move === 'enpassant') {
    newBoard[move.from[0]][move.from[1]] = null;
    newBoard[move.captured[0]][move.captured[1]] = null;
    newBoard[move.to[0]][move.to[1]] = `${move.color}P`;
  } else {
    newBoard[move.from[0]][move.from[1]] = null;
    newBoard[move.to[0]][move.to[1]] = move.newPiece;
  }

  return newBoard;
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
