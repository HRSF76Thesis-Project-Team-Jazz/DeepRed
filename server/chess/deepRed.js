const chessEval = require('./chessEval');


/**
 * Chess Playing Brain
 */

// Check for white's possible moves

/**
 * @param {array} board
 * @return {object} keys:   stringified coordinates of piece origin
 *                          '66'
 *                  values: array of possible destination coordinates:
 *                          [[6, 5], [6, 4]]
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
          if (row === 6 && !board[row - 1][col] &&
            !board[row - 2][col]) result[key].push([row - 2, col]);
          // capture NW
          if (col > 0 && board[row - 1][col - 1] &&
            board[row - 1][col - 1][0] === 'B') result[key].push([row - 1, col - 1]);
          // capture NE
          if (col < 7 && board[row - 1][col + 1] &&
            board[row - 1][col + 1][0] === 'B') result[key].push([row - 1, col + 1]);
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

// Check for black's possible moves

/**
 * @param {array} board
 * @return {object} keys:   stringified coordinates of piece origin
 *                          '66'
 *                  values: array of possible destination coordinates:
 *                          [[6, 5], [6, 4]]
 */

const getAvailableMovesBlack = (board) => {
  const result = {};
  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (board[row][col] && board[row][col][0] === 'B') {
        const piece = board[row][col];
        const key = row.toString() + col.toString();
        result[key] = [];

        if (piece[1] === 'P') {
          // advance 1
          if (!board[row + 1][col]) result[key].push([row + 1, col]);
          // advance 2
          if (row === 1 && !board[row + 1][col] && !board[row + 2][col]) result[key].push([row + 2, col]);
          // capture SW
          if (col > 0 && board[row + 1][col - 1] && board[row + 1][col - 1][0] === 'W') result[key].push([row + 1, col - 1]);
          // capture SE
          if (col < 7 && board[row + 1][col + 1] && board[row + 1][col + 1][0] === 'W') result[key].push([row + 1, col + 1]);
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
              if (board[currentRow][col][0] === 'W') result[key].push([currentRow, col]);
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
              if (board[currentRow][col][0] === 'W') result[key].push([currentRow, col]);
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
              if (board[row][currentCol][0] === 'W') result[key].push([row, currentCol]);
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
              if (board[row][currentCol][0] === 'W') result[key].push([row, currentCol]);
            }
          }
        }

        if (piece[1] === 'N') {
          // move NNW
          if (col > 0 && row > 1 &&
            (!board[row - 2][col - 1] || (board[row - 2][col - 1] && board[row - 2][col - 1][0] === 'W'))
          ) result[key].push([row - 2, col - 1]);
          // move NNE
          if (col < 7 && row > 1 &&
            (!board[row - 2][col + 1] || (board[row - 2][col + 1] && board[row - 2][col + 1][0] === 'W'))
          ) result[key].push([row - 2, col + 1]);
          // move EEN
          if (col < 6 && row > 0 &&
            (!board[row - 1][col + 2] || (board[row - 1][col + 2] && board[row - 1][col + 2][0] === 'W'))
          ) result[key].push([row - 1, col + 2]);
          // move EES
          if (col < 6 && row < 7 &&
            (!board[row + 1][col + 2] || (board[row + 1][col + 2] && board[row + 1][col + 2][0] === 'W'))
          ) result[key].push([row + 1, col + 2]);
          // move SSE
          if (col < 7 && row < 6 &&
            (!board[row + 2][col + 1] || (board[row + 2][col + 1] && board[row + 2][col + 1][0] === 'W'))
          ) result[key].push([row + 2, col + 1]);
          // move SSW
          if (col > 0 && row < 6 &&
            (!board[row + 2][col - 1] || (board[row + 2][col - 1] && board[row + 2][col - 1][0] === 'W'))
          ) result[key].push([row + 2, col - 1]);
          // move WWS
          if (col > 1 && row < 7 &&
            (!board[row + 1][col - 2] || (board[row + 1][col - 2] && board[row + 1][col - 2][0] === 'W'))
          ) result[key].push([row + 1, col - 2]);
          // move WWN
          if (col > 1 && row > 0 &&
            (!board[row - 1][col - 2] || (board[row - 1][col - 2] && board[row - 1][col - 2][0] === 'W'))
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][currentCol][0] === 'W') result[key].push([currentRow, currentCol]);
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
              if (board[currentRow][col][0] === 'W') result[key].push([currentRow, col]);
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
              if (board[currentRow][col][0] === 'W') result[key].push([currentRow, col]);
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
              if (board[row][currentCol][0] === 'W') result[key].push([row, currentCol]);
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
              if (board[row][currentCol][0] === 'W') result[key].push([row, currentCol]);
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
            } else if (board[currentRow][currentCol][0] === 'W') {
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
            } else if (board[currentRow][currentCol][0] === 'W') {
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
            } else if (board[currentRow][currentCol][0] === 'W') {
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
            } else if (board[currentRow][currentCol][0] === 'W') {
              result[key].push([currentRow, currentCol]);
            }
          } // end of K-SW

          // move up
          currentRow = row;
          if (currentRow - 1 >= 0) {
            currentRow -= 1;
            if (!board[currentRow][col]) {
              result[key].push([currentRow, col]);
            } else if (board[currentRow][col][0] === 'W') {
              result[key].push([currentRow, col]);
            }
          }
          // move down
          currentRow = row;
          if (currentRow + 1 <= 7) {
            currentRow += 1;
            if (!board[currentRow][col]) {
              result[key].push([currentRow, col]);
            } else if (board[currentRow][col][0] === 'W') {
              result[key].push([currentRow, col]);
            }
          }
          // move left
          currentCol = col;
          if (currentCol - 1 >= 0) {
            currentCol -= 1;
            if (!board[row][currentCol]) {
              result[key].push([row, currentCol]);
            } else if (board[row][currentCol][0] === 'W') {
              result[key].push([row, currentCol]);
            }
          }
          // move right
          currentCol = col;
          if (currentCol + 1 <= 7) {
            currentCol += 1;
            if (!board[row][currentCol]) {
              result[key].push([row, currentCol]);
            } else if (board[row][currentCol][0] === 'W') {
              result[key].push([row, currentCol]);
            }
          } // end of K move right
        } // end of 'K'
      } // end of if 'W'
    } // for loop i
  } // for loop j
  return result;
};


// *************************************** //
// ************  ATTACK CHECKS *********** //
// *************************************** //

/**
 * Input board, return if BK is in check
 * @param {array} board
 * @return {boolean}
 */

const blackIsChecked = (board) => {
  const whiteMoves = getAvailableMovesWhite(board);
  const positionBK = JSON.stringify(chessEval.findPiecePosition('BK', board)[0]);
  for (const key in whiteMoves) {
    if (whiteMoves[key].map(x => JSON.stringify(x)).indexOf(positionBK) >= 0) return true;
  }
  return false;
};

/**
 * Input board, return if WK is in check
 * @param {array} board
 * @return {boolean}
 */

const whiteIsChecked = (board) => {
  const blackMoves = getAvailableMovesBlack(board);
  const positionWK = JSON.stringify(chessEval.findPiecePosition('WK', board)[0]);
  for (const key in blackMoves) {
    if (blackMoves[key].map(x => JSON.stringify(x)).indexOf(positionWK) >= 0) return true;
  }
  return false;
};

/**
 * Return flags on positions for threatened black pieces
 * @param {array} board
 * @return {array} 0: safe | 1: under attack
 */

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

const piecesAttackedByBlack = (board) => {
  const blackMoves = getAvailableMovesBlack(board);
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
  for (const key in blackMoves) {
    blackMoves[key].forEach((xy) => {
      const x = xy[0];
      const y = xy[1];
      if (board[x][y]) result[x][y] = 1;
    });
  }
  return result;
};


/**
 *  Temporary tests for movement
 *  To be implemented in tests
 */

const showMovesByPiece = (board, piece, description) => {
  const color = piece[0];
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
  const moves = (color === 'W') ? getAvailableMovesWhite(board) : getAvailableMovesBlack(board);
  const movesBoard = board.map(row => row.map(col => (!col ? ' -- ' : ` ${col} `)));
  const piecesAttacked = (color === 'W') ? piecesAttackedByWhite(board) : piecesAttackedByBlack(board);

  console.log();
  console.log(`[ ${description} ]`);
  console.log(`=================== 【 ${color} ${(piece.length === 1) ? 'ALL MOVES' : label[piece[1]]} 】 ======================`.substr(-50));
  movesBoard.forEach(row => console.log(row.join(' | ')));
  pieces.forEach(key => moves[key].forEach((move) => {
    if (piecesAttacked[move[0]][move[1]]) {
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



module.exports.getAvailableMovesBlack = getAvailableMovesBlack;
module.exports.getAvailableMovesWhite = getAvailableMovesWhite;
module.exports.blackIsChecked = blackIsChecked;
module.exports.whiteIsChecked = whiteIsChecked;

module.exports.showMovesByPiece = showMovesByPiece;

