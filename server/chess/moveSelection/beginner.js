const safeMoves = require('../deepRed/safeMoves');
const pieceState = require('../pieceState');
const display = require('../deepRed/display');
const basic = require('../deepRed/basic');

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const { evalPieceState } = pieceState;
const { displayBoard } = display;
const { mutateBoard } = basic;

const getRandomMove = (board, color, currentState) => {
  const moves = (color === 'W') ?
    getSafeMovesWhite(board, currentState) : getSafeMovesBlack(board, currentState);

  let count = 0;
  const keys = Object.keys(moves);
  let move = {};

  for (let i = 0; i < keys.length; i += 1) {
    count += moves[keys[i]].length;
  }

  const choice = Math.floor(Math.random() * count);

  count = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if ((count + moves[keys[i]].length) > choice) {
      if (keys[i] !== 'specialMoves') {
        move = [keys[i], moves[keys[i]][choice - count]];
      } else {
        move = moves[keys[i]][choice - count];
      }
      break;
    }
    count += moves[keys[i]].length;
  }

  return [move, evalPieceState(board, move, color, currentState)];
};

module.exports = {
  getRandomMove,
};

let state = {
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

let turn = 'W';

displayBoard(board);
for (let i = 0; i < 10; i += 1) {
  const moveAndState = getRandomMove(board, turn, state);
  state = moveAndState[1];
  turn = (turn === 'W') ? 'B' : 'W';
  board = mutateBoard(board, moveAndState[0]);
  displayBoard(board);
  console.log(state);
}
