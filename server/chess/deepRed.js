const chessEval = require('./chessEval');

/**
 * Chess Playing Brain
 */

let whiteIsChecked;
let blackIsChecked;

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

const getAllMovesWhite = (board, pieceState) => {
  const result = {};

  const specialMoves = [];

  // ******* Castling
  // King can not castle out of check
  if (pieceState && !pieceState.hasMovedWK && !whiteIsChecked(board) &&
    board[7][4] === 'WK' && board[7][7] === 'WR' && board[7][0] === 'WR'
  ) {
    // King side castle
    if (!pieceState.hasMovedWKR &&
      !board[7][5] && !board[7][6] &&
      !whiteIsChecked(mutateBoard(board, ['74', '75'])) &&
      !whiteIsChecked(mutateBoard(board, ['74', '76']))
    ) {
      specialMoves.push('O-O');
    }
    // Queen side castle
    if (!pieceState.hasMovedWQR &&
      !board[7][3] && !board[7][2] && !board[7][1] &&
      !whiteIsChecked(mutateBoard(board, ['74', '73'])) &&
      !whiteIsChecked(mutateBoard(board, ['74', '72'])) &&
      !whiteIsChecked(mutateBoard(board, ['74', '71']))
    ) {
      specialMoves.push('O-O-O');
    }
  }

  // ******* En-passant
  if (pieceState && pieceState.canEnPassantW !== '') {
    const bp = pieceState.canEnPassantW;
    // from left
    if (bp[1] > 0 && board[3][+bp[1] - 1] === 'WP') {
      specialMoves.push({
        move: 'enpassant',
        from: `3${bp[1] - 1}`,
        to: `2${bp[1]}`,
        captured: `3${bp[1]}`,
      });
    }
    // from right
    if (bp[1] < 7 && board[3][+bp[1] + 1] === 'WP') {
      specialMoves.push({
        move: 'enpassant',
        from: `3${+bp[1] + 1}`,
        to: `2${+bp[1]}`,
        captured: `3${+bp[1]}`,
      });
    }
  }

  // ******* Pawn Promotion
  board[1].forEach((col, index) => {
    if (col === 'WP') {
      const newPieces = ['WQ', 'WR', 'WB', 'WN'];
      const move = {
        move: 'pawnPromotion',
        from: `1${index}`,
      };

      // advance 1
      if (!board[0][index]) {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `0${index}`, newPiece })));
      }

      // capture left
      if (index > 0 && board[0][index - 1] &&
        board[0][index - 1][0] === 'B') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `0${index - 1}`, newPiece })));
      }

      // capture right
      if (index < 7 && board[0][index + 1] &&
        board[0][index + 1][0] === 'B') {
        newPieces.forEach(newPiece =>
          specialMoves.push(Object.assign({}, move,
            { to: `0${index + 1}`, newPiece })));
      }
    }
  });

  if (specialMoves.length > 0) {
    result.specialMoves = specialMoves;
  }

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
    -           result[key].push([row, currentCol]);
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


const getSafeMovesBlack = (board, pieceState) => {
  const moves = getAllMovesBlack(board, pieceState);
  const result = (moves.specialMoves) ?
    { specialMoves: moves.specialMoves } : {};
  const pieces = Object.keys(moves).filter(x => x !== 'specialMoves');

  for (let i = 0; i < pieces.length; i += 1) {
    result[pieces[i]] = [];
    moves[pieces[i]].forEach((move) => {
      !blackIsChecked(mutateBoard(board, [pieces[i], [move[0], move[1]]])) &&
        result[pieces[i]].push(move);
    });
  }
  return result;
};

const getSafeMovesWhite = (board, pieceState) => {
  const moves = getAllMovesWhite(board, pieceState);
  const result = (moves.specialMoves) ?
    { specialMoves: moves.specialMoves } : {};
  const pieces = Object.keys(moves).filter(x => x !== 'specialMoves');
  for (let i = 0; i < pieces.length; i += 1) {
    result[pieces[i]] = [];
    moves[pieces[i]].forEach((move) => {
      !whiteIsChecked(mutateBoard(board, [pieces[i], [move[0], move[1]]])) &&
        result[pieces[i]].push(move);
    });
  }
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

blackIsChecked = (board) => {
  const whiteMoves = getAllMovesWhite(board);
  const positionBK = JSON.stringify(chessEval.findPiecePosition('BK', board)[0]);
  for (const key in whiteMoves) {
    if (key !== 'specialMoves') {
      if (whiteMoves[key].map(x => JSON.stringify(x)).indexOf(positionBK) >= 0) return true;
    }
  }
  return false;
};

/**
 * Input board, return if WK is in check
 * @param {array} board
 * @return {boolean}
 */

whiteIsChecked = (board) => {
  const blackMoves = getAllMovesBlack(board);
  const positionWK = JSON.stringify(chessEval.findPiecePosition('WK', board)[0]);
  for (const key in blackMoves) {
    if (key !== 'specialMOves') {
      if (blackMoves[key].map(x => JSON.stringify(x)).indexOf(positionWK) >= 0) return true;
    }
  }
  return false;
};

/**
 * Return flags on positions for threatened black pieces
 * @param {array} board
 * @return {array} 0: safe | 1: under attack
 */

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
  for (const key in blackMoves) {
    blackMoves[key].forEach((xy) => {
      const x = xy[0];
      const y = xy[1];
      if (board[x][y]) result[x][y] = 1;
    });
  }
  return result;
};




// ************  GAME END CHECKS  *********** //

/**
 * Return if white has any possible available moves
 * @param {array} board
 */

const whiteCanMove = (board) => {
  const moves = getSafeMovesWhite(board);
  const pieces = Object.keys(moves);
  for (let i = 0; i < pieces.length; i += 1) {
    if (moves[pieces[i]].length > 0) return true;
  }
  return false;
};

const isCheckmateWhite = board => whiteIsChecked(board) && !whiteCanMove(board);
const isStalemateWhite = board => !whiteIsChecked(board) && !whiteCanMove(board);

/**
 * Return if white has any possible available moves
 * @param {array} board
 */

const blackCanMove = (board) => {
  const moves = getSafeMovesBlack(board);
  const pieces = Object.keys(moves);
  for (let i = 0; i < pieces.length; i += 1) {
    if (moves[pieces[i]].length > 0) return true;
  }
  return false;
};

const isCheckmateBlack = board => blackIsChecked(board) && !blackCanMove(board);
const isStalemateBlack = board => !blackIsChecked(board) && !blackCanMove(board);


/**
 *  Temporary tests for movement
 *  To be implemented in tests
 */

const showMovesByPiece = (board, piece, pieceState, description) => {
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
  const moves = (color === 'W') ? getSafeMovesWhite(board, pieceState) : getSafeMovesBlack(board, pieceState);
  const specialMoves = (moves.specialMoves) ? moves.specialMoves.slice(0) : undefined;
  delete moves.specialMoves;

  const movesBoard = board.map(row => row.map(col => (!col ? ' -- ' : ` ${col} `)));
  const piecesAttacked = (color === 'W') ? piecesAttackedByWhite(board) : piecesAttackedByBlack(board);

  console.log();
  console.log(`[ ${description} ]`);
  console.log(`=================== 【 ${color} ${(piece.length === 1) ? 'ALL MOVES' : label[piece[1]]} 】 ======================`.substr(-50));
  // movesBoard.forEach(row => console.log(row.join(' | ')));
  pieces.forEach(key => moves[key].forEach((move) => {
    if (piecesAttacked[move[0]][move[1]]) {
      movesBoard[move[0]][move[1]] = `[${board[move[0]][move[1]]}]`;
    } else {
      movesBoard[move[0]][move[1]] = ' <> ';
    }
  }));

  const kRow = (color === 'W') ? 7 : 0;
  if (specialMoves && specialMoves.indexOf('O-O') >= 0) {
    movesBoard[kRow][5] = ' *O ';
    movesBoard[kRow][6] = ' O* ';
  }
  if (specialMoves && specialMoves.indexOf('O-O-O') >= 0) {
    movesBoard[kRow][2] = ' *O ';
    movesBoard[kRow][3] = ' O* ';
  }

  console.log('----------------------------------------------------');
  movesBoard.forEach(row => console.log(row.join(' | ')));
  console.log('----------------------------------------------------');
  console.log();
};

const showEvaluatedMoves = (board, moves, piece, description) => {
  const color = piece[0];
  const label = {
    P: 'Pawns',
    R: 'Rooks',
    N: 'Knights',
    B: 'Bishops',
    Q: 'Queen',
    K: 'King',
  };
  const movesBoard = board.map(row => row.map(col => (!col ? ' -- ' : ` ${col} `)));

  console.log();
  console.log(`[ ${description} ]`);
  console.log(`=================== 【 ${color} ${(piece.length === 1) ? 'ALL MOVES' : label[piece[1]]} 】 ======================`.substr(-50));
  movesBoard.forEach(row => console.log(row.join(' | ')));
  const keys = Object.keys(moves);
  for (let i = 0; i < keys.length; i += 1) {
    if (piece.length === 1 || board[keys[i][0]][keys[i][1]] === piece) {
      moves[keys[i]].forEach((move) => {
        if (movesBoard[move[0]][move[1]] === '--') {
          movesBoard[move[0]][move[1]] = `[${board[move[0]][move[1]]}]`;
        } else {
          movesBoard[move[0]][move[1]] = ' <> ';
        }
      });
    }
  }
  console.log('----------------------------------------------------');
  movesBoard.forEach(row => console.log(row.join(' | ')));
  console.log('----------------------------------------------------');
  console.log();
};

module.exports = {
  getAllMovesBlack,
  getAllMovesWhite,
  blackIsChecked,
  whiteIsChecked,
  whiteCanMove,
  blackCanMove,
  isCheckmateWhite,
  isStalemateWhite,
  isCheckmateBlack,
  isStalemateBlack,
  showMovesByPiece,
  getSafeMovesBlack,
  getSafeMovesWhite,
  showEvaluatedMoves,
};
