const basic = require('./basic');
const attacksWhite = require('./attacksWhite');

const { mutateBoard } = basic;
const { blackIsChecked } = attacksWhite;

// Check for black's possible moves

/**
 * @param {array} board
 * @return {object} keys:   stringified coordinates of piece origin
 *                          '66'
 *                  values: array of possible destination coordinates:
 *                          [[6, 5], [6, 4]]
 */

const getAllMovesBlack = (board, pieceState) => {
  const result = {};

  const specialMoves = [];

  // Castling
  // King can not castle out of check
  if (pieceState && !pieceState.hasMovedBK && !blackIsChecked(board) &&
    board[0][4] === 'BK' && board[0][7] === 'BR' && board[0][0] === 'BR'
  ) {
    // King side castle
    if (!pieceState.hasMovedBKR &&
      !board[0][5] && !board[0][6] &&
      !blackIsChecked(mutateBoard(board, ['04', '05'])) &&
      !blackIsChecked(mutateBoard(board, ['04', '06']))
    ) {
      specialMoves.push('O-O');
    }
    if (!pieceState.hasMovedBQR &&
      !board[0][3] && !board[0][2] && !board[0][1] &&
      !blackIsChecked(mutateBoard(board, ['04', '03'])) &&
      !blackIsChecked(mutateBoard(board, ['04', '02']))
    ) {
      specialMoves.push('O-O-O');
    }
  }

  // ******* En-passant
  if (pieceState && pieceState.canEnPassantB !== '') {
    const wp = pieceState.canEnPassantB;
    // from left
    console.log(wp, pieceState);
    if (wp[1] > 0 && board[4][+wp[1] - 1] === 'BP') {
      specialMoves.push({
        move: 'enpassant',
        from: `4${wp[1] - 1}`,
        to: `5${wp[1]}`,
        captured: `4${wp[1]}`,
      });
    }
    // from right
    if (wp[1] < 7 && board[4][+wp[1] + 1] === 'BP') {
      specialMoves.push({
        move: 'enpassant',
        from: `4${+wp[1] + 1}`,
        to: `5${+wp[1]}`,
        captured: `4${+wp[1]}`,
      });
    }
  }

  // ******* Pawn Promotion
  board[6].forEach((col, index) => {
    if (col === 'BP') {
      const newPieces = ['BQ', 'BR', 'BB', 'BN'];
      const move = {
        move: 'pawnPromotion',
        from: `6${index}`,
      };

      // advance 1
      if (!board[7][index]) {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `7${index}`, newPiece })));
      }

      // capture left
      if (index > 0 && board[7][index - 1] &&
        board[7][index - 1][0] === 'W') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `7${index - 1}`, newPiece })));
      }

      // capture right
      if (index < 7 && board[7][index + 1] &&
        board[7][index + 1][0] === 'W') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `7${index + 1}`, newPiece })));
      }
    }
  });

  if (specialMoves.length > 0) {
    result.specialMoves = specialMoves;
  }

  for (let row = 0; row < 8; row += 1) {
    for (let col = 0; col < 8; col += 1) {
      if (board[row][col] && board[row][col][0] === 'B') {
        const piece = board[row][col];
        const key = row.toString() + col.toString();
        result[key] = [];

        if (piece[1] === 'P') {
          // advance 1
          if (row < 6 && !board[row + 1][col]) result[key].push([row + 1, col]);
          // advance 2
          if (row === 1 && !board[row + 1][col] &&
            !board[row + 2][col]) result[key].push([row + 2, col]);
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

module.exports = {
  getAllMovesBlack,
};
