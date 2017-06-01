/**
 * Chess Playing Brain
 */

const getAvailableMovesWhite = (board) => {
  const result = {};
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (board[row][col] && board[row][col][0] === 'W') {

        const piece = board[row][col];
        const key = row.toString() + col.toString();
        result[key] = [];

        if (piece[1] === 'P') {
          // advance 1
          if (!board[row - 1][col]) result[key].push([row - 1, col]);
          // advance 2
          if (row === 6 && !board[row - 1][col] && !board[row - 2][col]) result[key].push([row - 2, col]);
          // capture NW
          if (col > 0 && board[row - 1][col - 1] && board[row - 1][col - 1][0] === 'B') result[key].push([row - 1, col - 1]);
          // capture NE
          if (col < 7 && board[row - 1][col + 1] && board[row - 1][col + 1][0] === 'B') result[key].push([row - 1, col + 1]);
        }

        if (piece[1] === 'R') {
          // move up
          let currentRow = row;
          let continueMove = true;

          while (continueMove && currentRow - 1 >= 0) {
            currentRow -= 1;
            if (!board[currentRow][col]) {
              result[key].push([currentRow, col]);
            } else {
              continueMove = false;
              if (board[currentRow][col][0] === 'B') result[key].push([currentRow, col]);
            }
          }

          // move down
          currentRow = row;
          continueMove = true;
          while (continueMove && currentRow + 1 <= 7) {
            currentRow += 1;
            if (!board[currentRow][col]) {
              result[key].push([currentRow, col]);
            } else {
              continueMove = false;
              if (board[currentRow][col][0] === 'B') result[key].push([currentRow, col]);
            }
          }

          // move left
          let currentCol = col;
          continueMove = true;
          while (continueMove && currentCol - 1 >= 0) {
            currentCol -= 1;
            if (!board[row][currentCol]) {
              result[key].push([row, currentCol]);
            } else {
              continueMove = false;
              if (board[row][currentCol][0] === 'B') result[key].push([row, currentCol]);
            }
          }

          // move right
          currentCol = col;
          continueMove = true;
          while (continueMove && currentCol + 1 <= 7) {
            currentCol += 1;
            if (!board[row][currentCol]) {
              result[key].push([row, currentCol]);
            } else {
              continueMove = false;
              if (board[row][currentCol][0] === 'B') result[key].push([row, currentCol]);
            }
          }
        }
      }
    }
  }
  return result;
};

module.exports.getAvailableMovesWhite = getAvailableMovesWhite;


let board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log('Pawns from start : ', getAvailableMovesWhite(board));


board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', null, 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, 'BP', null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log('Pawns with piece blocked / attack possible : ', getAvailableMovesWhite(board));

board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', null, 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 'WP', null, 'BP', null, null, null, null],
  [null, 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log('[Rooks] move up: ', getAvailableMovesWhite(board));

board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', null, 'BP', 'BP', 'BP', 'BP'],
  ['WR', null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 'WP', null, 'BP', null, null, null, null],
  [null, 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  [null, 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log('[Rooks] move down: ', getAvailableMovesWhite(board));

board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, 'WR'],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  [null, 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log('[Rooks] move left: ', getAvailableMovesWhite(board));

board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WR', null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  [null, 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log('[Rooks] move right: ', getAvailableMovesWhite(board));
