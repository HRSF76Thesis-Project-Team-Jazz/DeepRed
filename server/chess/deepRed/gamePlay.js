const safeMoves = require('./safeMoves');
const endGameChecks = require('./endGameChecks');
const basic = require('./basic');
const display = require('./display');

const { displayBoard } = display;
const { mutateBoard } = basic;

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const {
  isCheckmateWhite,
  isCheckmateBlack,
  isStalemateWhite,
  isStalemateBlack,
} = endGameChecks;

// let board = [
//   [null, null, null, null, 'BK', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  // ['WR', null, null, null, 'WK', null, null, 'WR'],
// ];

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

const whiteMove = (board, pieceState) => {
  const moves = getSafeMovesWhite(board, pieceState);
  const newState = pieceState;
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

  newState.canEnPassantB = '';

  if (!Array.isArray(move)) {
    if (move.move === 'castle') {
      newState.hasMovedWK = true;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    if (board[row][col] === 'WP' && +row === 6 && +toRow === 4) {
      newState.canEnPassantB = `4${col}`;
    }
  }

  return [move, newState];
};

const blackMove = (board, pieceState) => {
  const moves = getSafeMovesBlack(board, pieceState);
  const newState = pieceState;
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

  newState.canEnPassantW = '';

  if (!Array.isArray(move)) {
    if (move.move === 'castle') {
      newState.hasMovedWK = true;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    if (board[row][col] === 'WP' && +row === 1 && +toRow === 3) {
      newState.canEnPassantW = `3${col}`;
    }
  }

  return [move, newState];
};

let gameEnded = false;

console.log('=== START GAME ===');
displayBoard(board);

let currentMoveWhite;
let currentMoveBlack;
let move;
let newState;

let moveCount = 1;

setInterval(() => {
  if (!gameEnded) {
    console.log(`=== [${moveCount}] WHITE MOVE ===`);
    currentMoveWhite = whiteMove(board, pieceState);
    move = currentMoveWhite[0];
    newState = currentMoveWhite[1];
    board = mutateBoard(board, move);

    !gameEnded && displayBoard(board);
    if (isCheckmateWhite(board)) {
      gameEnded = true;
      console.log('**** WHITE CHECKMATE ***');
    }
    if (isStalemateBlack(board)) {
      gameEnded = true;
      console.log('**** STALEMATE ***');
    }
  }

  if (!gameEnded) {
    currentMoveBlack = blackMove(board, newState);
    move = currentMoveBlack[0];
    newState = currentMoveBlack[1];
    board = mutateBoard(board, move);

    setTimeout(() => {
      console.log(`=== [${moveCount}] BLACK MOVE ===`);
      !gameEnded && displayBoard(board);
    }, 100);

    if (isCheckmateBlack(board) || isStalemateWhite(board)) {
      gameEnded = true;
      (isCheckmateBlack(board)) ? console.log('**** BLACK WINS ***') : console.log('**** STALEMATE ***');
    }
  }

  moveCount += 1;
}, 200);
