const chessEval = require('./chessEval');


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

        if (piece[1] === 'N') {
          // move NNW
          if (col > 0 && row > 1 &&
            (!board[row - 2][col - 1] || (board[row - 2][col - 1] && board[row - 2][col - 1][0] === 'B'))
          ) result[key].push([row - 2, col - 1]);
          // move NNE
          if (col < 7 && row > 1 &&
            (!board[row - 2][col + 1] || (board[row - 2][col + 1] && board[row - 2][col + 1][0] === 'B'))
          ) result[key].push([row - 2, col + 1]);
          // move EEN
          if (col < 6 && row > 0 &&
            (!board[row - 1][col + 2] || (board[row - 1][col + 2] && board[row - 1][col + 2][0] === 'B'))
          ) result[key].push([row - 1, col + 2]);
          // move EES
          if (col < 6 && row < 7 &&
            (!board[row + 1][col + 2] || (board[row + 1][col + 2] && board[row + 1][col + 2][0] === 'B'))
          ) result[key].push([row + 1, col + 2]);
          // move SSE
          if (col < 7 && row < 6 &&
            (!board[row + 2][col + 1] || (board[row + 2][col + 1] && board[row + 2][col + 1][0] === 'B'))
          ) result[key].push([row + 2, col + 1]);
          // move SSW
          if (col > 0 && row < 6 &&
            (!board[row + 2][col - 1] || (board[row + 2][col - 1] && board[row + 2][col - 1][0] === 'B'))
          ) result[key].push([row + 2, col - 1]);
          // move WWS
          if (col > 1 && row < 7 &&
            (!board[row + 1][col - 2] || (board[row + 1][col - 2] && board[row + 1][col - 2][0] === 'B'))
          ) result[key].push([row + 1, col - 2]);
          // move WWN
          if (col > 1 && row > 0 &&
            (!board[row - 1][col - 2] || (board[row - 1][col - 2] && board[row - 1][col - 2][0] === 'B'))
          ) result[key].push([row - 1, col - 2]);
        }

        if (piece[1] === 'B') {
          // NW
          let currentRow = row;
          let currentCol = col;
          let continueMove = true;
          while (continueMove && currentRow - 1 >= 0 && currentCol - 1 >= 0) {
            currentRow -= 1;
            currentCol -= 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          }

          // NE
          currentRow = row;
          currentCol = col;
          continueMove = true;
          while (continueMove && currentRow - 1 >= 0 && currentCol + 1 <= 7) {
            currentRow -= 1;
            currentCol += 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          }

          // SE
          currentRow = row;
          currentCol = col;
          continueMove = true;
          while (continueMove && currentRow + 1 <= 7 && currentCol + 1 <= 7) {
            currentRow += 1;
            currentCol += 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          }

          // SW
          currentRow = row;
          currentCol = col;
          continueMove = true;
          while (continueMove && currentRow + 1 <= 7 && currentCol - 1 >= 0) {
            currentRow += 1;
            currentCol -= 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          } // end of B-SW
        } // end of 'B'

        if (piece[1] === 'Q') {
          // NW
          let currentRow = row;
          let currentCol = col;
          let continueMove = true;
          while (continueMove && currentRow - 1 >= 0 && currentCol - 1 >= 0) {
            currentRow -= 1;
            currentCol -= 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          }

          // NE
          currentRow = row;
          currentCol = col;
          continueMove = true;
          while (continueMove && currentRow - 1 >= 0 && currentCol + 1 <= 7) {
            currentRow -= 1;
            currentCol += 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          }

          // SE
          currentRow = row;
          currentCol = col;
          continueMove = true;
          while (continueMove && currentRow + 1 <= 7 && currentCol + 1 <= 7) {
            currentRow += 1;
            currentCol += 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          }

          // SW
          currentRow = row;
          currentCol = col;
          continueMove = true;
          while (continueMove && currentRow + 1 <= 7 && currentCol - 1 >= 0) {
            currentRow += 1;
            currentCol -= 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else {
              continueMove = false;
              if (board[currentRow][currentCol][0] === 'B') result[key].push([currentRow, currentCol]);
            }
          } // end of Q-SW

          // move up
          currentRow = row;
          continueMove = true;
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
          currentCol = col;
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
        } // end of 'Q'

        if (piece[1] === 'K') {
          // NW
          let currentRow = row;
          let currentCol = col;
          if (currentRow - 1 >= 0 && currentCol - 1 >= 0) {
            currentRow -= 1;
            currentCol -= 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else if (board[currentRow][currentCol][0] === 'B') {
              result[key].push([currentRow, currentCol]);
            }
          }

          // NE
          currentRow = row;
          currentCol = col;
          if (currentRow - 1 >= 0 && currentCol + 1 <= 7) {
            currentRow -= 1;
            currentCol += 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else if (board[currentRow][currentCol][0] === 'B') {
              result[key].push([currentRow, currentCol]);
            }
          }

          // SE
          currentRow = row;
          currentCol = col;
          if (currentRow + 1 <= 7 && currentCol + 1 <= 7) {
            currentRow += 1;
            currentCol += 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else if (board[currentRow][currentCol][0] === 'B') {
              result[key].push([currentRow, currentCol]);
            }
          }

          // SW
          currentRow = row;
          currentCol = col;
          if (currentRow + 1 <= 7 && currentCol - 1 >= 0) {
            currentRow += 1;
            currentCol -= 1;
            if (!board[currentRow][currentCol]) {
              result[key].push([currentRow, currentCol]);
            } else if (board[currentRow][currentCol][0] === 'B') {
              result[key].push([currentRow, currentCol]);
            }
          } // end of K-SW

          // move up
          currentRow = row;
          if (currentRow - 1 >= 0) {
            currentRow -= 1;
            if (!board[currentRow][col]) {
              result[key].push([currentRow, col]);
            } else if (board[currentRow][col][0] === 'B') {
              result[key].push([currentRow, col]);
            }
          }
          // move down
          currentRow = row;
          if (currentRow + 1 <= 7) {
            currentRow += 1;
            if (!board[currentRow][col]) {
              result[key].push([currentRow, col]);
            } else if (board[currentRow][col][0] === 'B') {
              result[key].push([currentRow, col]);
            }
          }
          // move left
          currentCol = col;
          if (currentCol - 1 >= 0) {
            currentCol -= 1;
            if (!board[row][currentCol]) {
              result[key].push([row, currentCol]);
            } else if (board[row][currentCol][0] === 'B') {
              result[key].push([row, currentCol]);
            }
          }
          // move right
          currentCol = col;
          if (currentCol + 1 <= 7) {
            currentCol += 1;
            if (!board[row][currentCol]) {
              result[key].push([row, currentCol]);
            } else if (board[row][currentCol][0] === 'B') {
              result[key].push([row, currentCol]);
            }
          } // end of K move right
        } // end of 'K'
      } // end of if 'W'
    } // for loop i
  } // for loop j
  return result;
};

const blackIsChecked = (board) => {
  const whiteMoves = getAvailableMovesWhite(board);
  const positionBK = JSON.stringify(chessEval.findPiecePosition('BK', board)[0]);
  // console.log(whiteMoves, positionBK);
  for (const key in whiteMoves) {
    if (whiteMoves[key].map(x => JSON.stringify(x)).indexOf(positionBK) >= 0) return true;
  }
  return false;
};

const piecesAttackedByWhite = (board) => {
  const whiteMoves = getAvailableMovesWhite(board);
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
  for (const key in whiteMoves) {
    whiteMoves[key].forEach((xy) => {
      const x = xy[0];
      const y = xy[1];
      if (board[x][y]) result[x][y] = 1;
    });
  }
  return result;
};

module.exports.getAvailableMovesWhite = getAvailableMovesWhite;
module.exports.blackIsChecked = blackIsChecked;



/**
 *  Temporary tests for movement
 *  To be implemented in tests
 */

const showMovesByPiece = (board, piece) => {
  const label = {
    P: 'Pawns',
    R: 'Rooks',
    N: 'Knights',
    B: 'Bishops',
    Q: 'Queen',
    K: 'King',
  };
  const pieces = chessEval.findPiecePosition(piece, board)
    .map(array => array[0].toString() + array[1].toString());
  const moves = getAvailableMovesWhite(board);
  const movesBoard = board.map(row => row.map(col => (!col ? ' -- ' : ` ${col} `)));
  const blackPiecesAttacked = piecesAttackedByWhite(board);

  console.log();
  console.log(`=================== 【 ${(piece.length === 1) ? 'ALL MOVES' : label[piece[1]]} 】 ======================`.substr(-50));
  movesBoard.forEach(row => console.log(row.join(' | ')));
  pieces.forEach(key => moves[key].forEach((move) => {
    if (blackPiecesAttacked[move[0]][move[1]]) {
      movesBoard[move[0]][move[1]] = `[${board[move[0]][move[1]]}]`;
    } else {
      movesBoard[move[0]][move[1]] = ' <> ';
    }
  }));
  console.log('----------------------------------------------------');
  movesBoard.forEach(row => console.log(row.join(' | ')));
  console.log('----------------------------------------------------');
  console.log();
};

let board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WP');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, 'WN', null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', null, 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WN');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 'WR', null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', null],
];

showMovesByPiece(board, 'WR');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 'WB', null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', null, 'WN', 'WR'],
];

showMovesByPiece(board, 'WB');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, 'WQ', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WQ');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, 'WQ', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WR');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  ['BK', null, null, null, 'WQ', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WQ');
console.log('Is BK in check? ', blackIsChecked(board));
showMovesByPiece(board, 'W');

board = [
  ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  ['BK', null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, 'WB', null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', null, 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WB');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  ['BK', null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 'WN', null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', null, 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WN');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, 'WK', null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', null, 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WK');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, 'WK', null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', null, 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WK');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, 'WK'],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', '--', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WK');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', null, 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', null, 'BP', 'BP', 'BP'],
  [null, null, 'BN', null, null, null, null, null],
  [null, null, null, null, 'BP', null, null, null],
  [null, null, null, null, 'WP', null, null, null],
  [null, null, null, null, null, 'WN', null, null],
  ['WP', 'WP', 'WP', 'WP', null, 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', null, 'WR'],
];

showMovesByPiece(board, 'W');
