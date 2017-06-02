
const deepRed = require('../chess/deepRed');

const showMovesByPiece = deepRed.showMovesByPiece;
const blackIsChecked = deepRed.blackIsChecked;
const whiteIsChecked = deepRed.whiteIsChecked;


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

showMovesByPiece(board, 'WP', 'WP movement from home');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', null, 'BP', 'BP', null, 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, 'BP', null, null, null, null, null, null],
  [null, null, null, null, 'BP', null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WP', 'WP movement from home & attack');

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

showMovesByPiece(board, 'WN', 'WN movement & attack');

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

showMovesByPiece(board, 'WR', 'WR movement & attack');

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

showMovesByPiece(board, 'WB', 'WB movement & attack');

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

showMovesByPiece(board, 'WQ', 'WQ movement & attack');
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

showMovesByPiece(board, 'WQ', 'WQ movement & check');
console.log('Is BK in check? ', blackIsChecked(board));

showMovesByPiece(board, 'W', 'All moves white');

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

showMovesByPiece(board, 'WB', 'WB movement & check');
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

showMovesByPiece(board, 'WN', 'WN check');
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

showMovesByPiece(board, 'WK movement');

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

showMovesByPiece(board, 'WK movement & attack');
console.log('Is BK in check? ', blackIsChecked(board));

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, 'WK'],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', null, 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'WK');
console.log('Is BK in check? ', blackIsChecked(board));

showMovesByPiece(board, 'W', 'All whte moves');

// Test black movement

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'BP', 'BP movement from home');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', null, 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 'BN', null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'BN', 'BN movement');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', null, 'BN', 'BR'],
  ['BP', null, 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, 'BP', null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 'BB', null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'BB', 'BB movement');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', null],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 'BR', null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'BR', 'BR movement');

board = [
  ['BR', 'BN', 'BB', null, 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, 'BQ', null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

showMovesByPiece(board, 'BQ', 'BQ movement');

board = [
  ['BR', 'BN', 'BB', 'BQ', null, 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, 'WP', null, null, null, null, null],
  [null, null, null, 'BK', 'WB', null, null, null],
  [null, null, 'WN', null, null, null, null, null],
  ['WP', 'WP', null, 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', null, 'WB', 'WQ', 'WK', null, 'WN', 'WR'],
];

showMovesByPiece(board, 'BK', 'BK movement and attack');

board = [
  ['BR', 'BN', 'BB', 'BQ', null, 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, 'WP', null, null, null, null, null],
  [null, null, null, 'BK', 'WB', null, null, null],
  [null, null, 'WN', null, null, null, null, null],
  ['WP', 'WP', null, 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', null, 'WB', 'WQ', 'WK', null, 'WN', 'WR'],
];

showMovesByPiece(board, 'B', 'All black moves');
