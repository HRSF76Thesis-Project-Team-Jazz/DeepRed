const deepRed = require('./index');

const {
  showMovesByPiece,
} = deepRed.display;

const { whiteIsChecked } = deepRed.attacksBlack;
const { blackIsChecked } = deepRed.attacksWhite;

const {
  showEvaluatedMoves,
  getAllMovesWhite,
  getAllMovesBlack,
  getSafeMovesWhite,
  getSafeMovesBlack,
  isStalemateBlack,
  isStalemateWhite,
  isCheckmateBlack,
  isCheckmateWhite,
  cleanBlackMoves,
  cleanWhiteMoves,
  whiteCanMove,
  blackCanMove,
} = deepRed;

let blackMoves;

const pieceState = {
  hasMovedWK: false,
  hasMovedWKR: false,
  hasMovedWQR: false,
  hasMovedBK: false,
  hasMovedBKR: false,
  hasMovedBQR: false,
  canEnPassantW: '',
  canEnPassantB: '',
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

// showMovesByPiece(board, 'WP', 'WP movement from home');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', null, 'BP', 'BP', null, 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, 'BP', null, null, null, null, null, null],
//   [null, null, null, null, 'BP', null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WP', 'WP movement from home & attack');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'WN', null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', null, 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WN', 'WN movement & attack');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, 'WR', null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', null],
// ];

// showMovesByPiece(board, 'WR', 'WR movement & attack');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, 'WB', null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', null, 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WB', 'WB movement & attack');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WQ', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WQ', 'WQ movement & attack');
// console.log('Is BK in check? ', blackIsChecked(board));

// board = [
//   ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   ['BK', null, null, null, 'WQ', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WQ', 'WQ movement & check');
// console.log('Is BK in check? ', blackIsChecked(board));

// showMovesByPiece(board, 'W', 'All moves white');

// board = [
//   ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   ['BK', null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, 'WB', null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', null, 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WB', 'WB movement & check');
// console.log('Is BK in check? ', blackIsChecked(board));

// board = [
//   ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   ['BK', null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, 'WN', null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', null, 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WN', 'WN check');
// console.log('Is BK in check? ', blackIsChecked(board));

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, 'WK', null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', null, 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WK movement');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, 'WK', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', null, 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WK', 'WK movement & attack');
// console.log('Is BK in check? ', blackIsChecked(board));

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, 'WK'],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', null, 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WK');
// console.log('Is BK in check? ', blackIsChecked(board));

// showMovesByPiece(board, 'W', 'All whte moves');

// // Test black movement

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'BP', 'BP movement from home');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', null, 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, 'BN', null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'BN', 'BN movement');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', null, 'BN', 'BR'],
//   ['BP', null, 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, 'BP', null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, 'BB', null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'BB', 'BB movement');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', null],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, 'BR', null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'BR', 'BR movement');

// board = [
//   ['BR', 'BN', 'BB', null, 'BK', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, 'BQ', null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'BQ', 'BQ movement');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', null, 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'WP', null, null, null, null, null],
//   [null, null, null, 'BK', 'WB', null, null, null],
//   [null, null, 'WN', null, null, null, null, null],
//   ['WP', 'WP', null, 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', null, 'WB', 'WQ', 'WK', null, 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'BK', 'BK movement and attack');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', null, 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'WP', null, null, null, null, null],
//   [null, null, null, 'BK', 'WB', null, null, null],
//   [null, null, 'WN', null, null, null, null, null],
//   ['WP', 'WP', null, 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', null, 'WB', 'WQ', 'WK', null, 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'B', 'All black moves');

board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, 'BB', null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'BQ', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

// showMovesByPiece(board, 'W', 'All white moves');
// // console.log('getAllMovesWhite: ', getAllMovesWhite(board));
// console.log('whiteCanMove: ', whiteCanMove(board));
// console.log('isStalemateWhite: ', isStalemateWhite(board));
// console.log('isCheckmateWhite: ', isCheckmateWhite(board));

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'BB', null, null, null, null, null],
//   [null, null, 'BQ', null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, 'WK', null, null, null, null],
// ];

// showMovesByPiece(board, 'W', 'All white moves');
// // console.log('getAllMovesWhite: ', getAllMovesWhite(board));
// console.log('whiteCanMove: ', whiteCanMove(board));
// console.log('isStalemateWhite: ', isStalemateWhite(board));
// console.log('isCheckmateWhite: ', isCheckmateWhite(board));


// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, 'WR', null, 'BP', 'BK', 'BP', null, 'WQ'],
//   [null, null, null, null, 'BP', null, null, null],
//   [null, null, 'BP', null, null, 'WP', null, null],
//   [null, null, null, null, 'WR', null, null, null],
//   ['WB', null, null, null, null, null, null, null],
// ];

// showMovesByPiece(board, 'BP', 'BP movement from home does not endanger BK');
// showEvaluatedMoves(board, getSafeMovesBlack(board), 'BP', 'All BP moves: BK checks disallowed');

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WK', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'BK', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
// ];

// const cleanedBlackMoves = getSafeMovesBlack(board);

// showMovesByPiece(board, 'B', 'All B moves: BK checks allowed');
// showEvaluatedMoves(board, cleanedBlackMoves, 'B', 'All B moves: BK checks disallowed');

// const cleanedWhiteMoves = getSafeMovesWhite(board);

// showMovesByPiece(board, 'W', 'All W moves: WK checks allowed');
// showEvaluatedMoves(board, cleanedWhiteMoves, 'W', 'All W moves: WK checks disallowed');

// board = [
//   ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', null],
//   ['BP', 'BP', 'BP', 'BP', 'BP', null, 'BP', 'BP'],
//   [null, null, null, null, 'BR', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'WP', 'BP', null, 'BP', 'WP', null],
//   ['WP', 'WP', null, 'WP', 'WP', 'WP', null, 'WP'],
//   ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
// ];

// showMovesByPiece(board, 'WP', 'WP capture / do not endanger WK');

// board = [
//   [null, null, null, null, 'BQ', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WR', null, null, null],
//   ['BR', null, null, 'WR', 'WK', null, 'WR', 'BR'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WR', null, null, null],
//   [null, null, null, null, null, null, 'WR', null],
//   [null, null, null, null, 'BQ', null, null, 'BB'],
// ];

// showMovesByPiece(board, 'WR', 'WR movement does not endanger WK');

// board = [
//   [null, null, null, null, 'BR', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WN', null, null, null],
//   ['BR', null, null, 'WN', 'WK', null, 'WN', 'BR'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WN', null, 'WN', null],
//   [null, null, null, null, null, null, null, 'BB'],
//   [null, null, null, null, 'BQ', null, null, null],
// ];

// showMovesByPiece(board, 'WN', 'WN movement does not endanger WK');

// board = [
//   [null, null, null, null, 'BR', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WB', null, null, null],
//   ['BR', null, null, 'WB', 'WK', null, 'WB', 'BR'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WB', null, 'WB', null],
//   [null, null, null, null, null, null, null, 'BB'],
//   [null, null, null, null, 'BQ', null, null, null],
// ];

// showMovesByPiece(board, 'WB', 'WB movement does not endanger WK');

// board = [
//   [null, null, null, null, 'BR', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WQ', null, null, null],
//   ['BR', null, null, 'WQ', 'WK', null, 'WQ', 'BR'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WQ', null, 'WQ', null],
//   [null, null, null, null, null, null, null, 'BB'],
//   [null, null, null, null, 'BQ', null, null, null],
// ];

// showMovesByPiece(board, 'WQ', 'WQ movement does not endanger WK');

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'BB', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'WK', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'BB', null, null, null],
//   [null, null, null, null, null, null, null, null],
// ];

// showMovesByPiece(board, 'WK', 'WK movement does not endanger WK');

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, 'BB', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, 'WK', null, null, null, null],
//   [null, null, null, null, null, 'BB', null, null],
//   [null, null, null, null, 'BB', null, null, null],
//   [null, null, null, null, null, null, null, null],
// ];

// showMovesByPiece(board, 'WK', 'WK movement does not endanger WK');

// showMovesByPiece(board, 'W', 'All white moves');
// // console.log('getAllMovesWhite: ', getAllMovesWhite(board));
// console.log('whiteCanMove: ', whiteCanMove(board));
// console.log('isStalemateWhite: ', isStalemateWhite(board));
// console.log('isCheckmateWhite: ', isCheckmateWhite(board));

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'BB', null, null, null, null, null],
//   [null, null, 'BQ', null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, 'WK', null, null, null, null],
// ];

// showMovesByPiece(board, 'W', pieceState, 'All white moves');
// console.log('getAllMovesWhite: ', getAllMovesWhite(board, pieceState));
// console.log('whiteCanMove: ', whiteCanMove(board));
// console.log('isStalemateWhite: ', isStalemateWhite(board));
// console.log('isCheckmateWhite: ', isCheckmateWhite(board));

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'WB', null, null, null, null, null],
//   [null, null, 'WQ', null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, 'BK', null, null, null, null],
// ];

// showMovesByPiece(board, 'B', pieceState, 'All black moves');
// // console.log('getAllMovesWhite: ', getAllMovesWhite(board));
// console.log('blackCanMove: ', blackCanMove(board));
// console.log('isStalemateBlack: ', isStalemateBlack(board));
// console.log('isCheckmateBlack: ', isCheckmateBlack(board));

// /**
//  * CHECK WHITE CASTING
//  */

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

// showMovesByPiece(board, 'W', pieceState, 'Check castling');
// showMovesByPiece(board, 'W', Object.assign({}, pieceState, { hasMovedWKR: true }), 'Disallow WKR castle if WKR has moved');

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

// showMovesByPiece(board, 'W', Object.assign({}, pieceState, { hasMovedWQR: true }), 'Disallow WQR castle if WQR has moved');

// board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

// showMovesByPiece(board, 'W', Object.assign({}, pieceState, { hasMovedWK: true }), 'Disallow castle if WK has moved');

// board = [
//   [null, null, null, null, 'BR', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

// // console.log(getAllMovesWhite(board, pieceState));
// showMovesByPiece(board, 'W', pieceState, 'Can not castle out of check');

// board = [
//   [null, null, null, 'BR', null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

// // console.log(getAllMovesWhite(board, pieceState));
// showMovesByPiece(board, 'W', pieceState, 'Can not castle through attack');

// board = [
//   [null, null, null, null, null, 'BQ', null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

// // console.log(getAllMovesWhite(board, pieceState));
// showMovesByPiece(board, 'W', pieceState, 'Can not castle through attack');

/**
 * CHECK BLACK CASTING
 */

board = [
  ['BR', null, null, null, 'BK', null, null, 'BR'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];

showMovesByPiece(board, 'B', pieceState, 'Check castling');
showMovesByPiece(board, 'B', Object.assign({}, pieceState, { hasMovedBK: true }), 'Disallow castle if BK has moved');
board = [
  ['BR', null, null, null, 'BK', null, null, 'BR'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];

showMovesByPiece(board, 'B', Object.assign({}, pieceState, { hasMovedBKR: true }), 'Disallow BKR castle if BKR has moved');
board = [
  ['BR', null, null, null, 'BK', null, null, 'BR'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
];

showMovesByPiece(board, 'B', Object.assign({}, pieceState, { hasMovedBQR: true }), 'Disallow BQR castle if BQR has moved');

board = [
  ['BR', null, null, null, 'BK', null, null, 'BR'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, 'WR', null, null, null],
];

showMovesByPiece(board, 'B', pieceState, 'Can not castle out of check');

board = [
  ['BR', null, null, null, 'BK', null, null, 'BR'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, 'WR', null, null, null, null],
];

showMovesByPiece(board, 'B', pieceState, 'Can not castle through attack');

board = [
  ['BR', null, null, null, 'BK', null, null, 'BR'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, 'WQ', null, null],
];

showMovesByPiece(board, 'B', pieceState, 'Can not castle through attack');
