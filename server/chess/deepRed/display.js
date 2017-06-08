const basic = require('./basic');
const movesWhite = require('./movesWhite');
const movesBlack = require('./movesBlack');
const attacksBlack = require('./attacksBlack');
const attacksWhite = require('./attacksWhite');

const { findPiecePosition } = basic;
const { getSafeMovesWhite } = movesWhite;
const { getSafeMovesBlack } = movesBlack;
const { piecesAttackedByBlack } = attacksBlack;
const { piecesAttackedByWhite } = attacksWhite;

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
  const pieces = findPiecePosition(piece, board)
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
  showMovesByPiece,
  showEvaluatedMoves,
};
