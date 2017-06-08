// Check for white's possible moves
// No King checks

/**
 * @param {array} board
 * @param {object} pieceState   {
 *                                hasMovedWK: boolean,
 *                                hasMovedWKR: boolean,
 *                                hasMovedWQR: boolean,
 *                                hasMovedBK: boolean,
 *                                hasMovedBKR: boolean,
 *                                hasMovedBQR: boolean,
 *                                canEnPassantW: string, // 'rc' : row and column
 *                                canEnPasswantB: string,
 *                              }
 * @return {object} keys:   stringified coordinates of piece origin
 *                          '66'
 *                  values: array of possible destination coordinates:
 *                          [[6, 5], [6, 4]]
 */

const getAllMovesWhite = (board) => {
  const result = {};

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (board[row][col] && board[row][col][0] === 'W') {
        const piece = board[row][col];
        const key = row.toString() + col.toString();
        result[key] = [];

        if (piece[1] === 'P') {
          // advance 1
          if (row > 1 && !board[row - 1][col]) result[key].push([row - 1, col]);
          // advance 2
          if (row === 6 && !board[row - 1][col] &&
            !board[row - 2][col]
          ) result[key].push([row - 2, col]);
          // capture NW
          if (row > 1 && col > 0 && board[row - 1][col - 1] &&
            board[row - 1][col - 1][0] === 'B'
          ) result[key].push([row - 1, col - 1]);
          // capture NE
          if (row > 1 && col < 7 && board[row - 1][col + 1] &&
            board[row - 1][col + 1][0] === 'B'
          ) result[key].push([row - 1, col + 1]);
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

module.exports = {
  getAllMovesWhite,
};
