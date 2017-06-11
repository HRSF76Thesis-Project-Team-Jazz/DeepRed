const safeMoves = require('./safeMoves');
const endGameChecks = require('./endGameChecks');
const basic = require('./basic');
const display = require('./display');
const chessEncode = require('../chessEncode');

const { displayBoard } = display;
const { transcribeBoard, encodeBoard } = chessEncode;

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

// let board = [
//   ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
//   ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//   ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
// ];

// const pieceState = {
//   hasMovedWK: false,
//   hasMovedWKR: false,
//   hasMovedWQR: false,
//   hasMovedBK: false,
//   hasMovedBKR: false,
//   hasMovedBQR: false,
//   canEnPassantW: '',
//   canEnPassantB: '',
//   countBlackPieces: 16,
//   countWhitePieces: 16,
//   capturedWhite: [],
//   capturedBlack: [],
//   lastCapture: 0,
//   lastPawn: 0,
//   moveCount: 0,
//   castle: 0,
//   pawnPromotion: 0,
//   enPassant: 0,
// };

const whiteMove = (board, pieceState) => {
  const moves = getSafeMovesWhite(board, pieceState);
  const newState = pieceState;
  newState.moveCount += 1;

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
      newState.castle += 1;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
    if (move.move === 'enpassant') {
      newState.lastCapture = newState.moveCount;
      newState.capturedWhite.push('BP');
      newState.countBlackPieces -= 1;
      newState.enPassant += 1;
    }
    if (move.move === 'pawnPromotion') {
      const row = move.to[0];
      const col = move.to[1];
      if (board[row][col]) {
        newState.countBlackPieces -= 1;
        newState.capturedWhite.push(board[row][col]);
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    const toCol = move[1][1];
    if (board[row][col][1] === 'P') newState.lastPawn = newState.moveCount;
    if (board[toRow][toCol]) {
      newState.lastCapture = newState.moveCount;
      newState.capturedWhite.push(board[toRow][toCol]);
      newState.countBlackPieces -= 1;
    }

    if (board[row][col] === 'WP' && +row === 6 && +toRow === 4) {
      newState.canEnPassantB = `4${col}`;
    }
  }

  return [move, newState];
};

const blackMove = (board, pieceState) => {
  const moves = getSafeMovesBlack(board, pieceState);
  const newState = pieceState;
  newState.moveCount += 1;

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
      newState.castle += 1;
      if (move.side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    }
    if (move.move === 'enpassant') {
      newState.lastCapture = newState.moveCount;
      newState.capturedBlack.push('WP');
      newState.countWhitePieces -= 1;
      newState.enPassant += 1;
    }
    if (move.move === 'pawnPromotion') {
      const row = move.to[0];
      const col = move.to[1];
      if (board[row][col]) {
        newState.countWhitePieces -= 1;
        newState.capturedBlack.push(board[row][col]);
      }
    }
  } else {
    const row = move[0][0];
    const toRow = move[1][0];
    const col = move[0][1];
    const toCol = move[1][1];
    if (board[row][col][1] === 'P') newState.lastPawn = newState.moveCount;
    if (board[toRow][toCol]) {
      newState.lastCapture = newState.moveCount;
      newState.capturedBlack.push(board[toRow][toCol]);
      newState.countWhitePieces -= 1;
    }
    if (board[row][col] === 'WP' && +row === 1 && +toRow === 3) {
      newState.canEnPassantW = `3${col}`;
    }
  }

  return [move, newState];
};


const simulateGames = (number, displayAll, displayFn) => {

  let transcribeCount = 0;
  let encodeCount = 0;

  let gameCount = 0;
  // const interval = 2;
  const gameSummary = {
    games: 0,
    whiteWins: 0,
    blackWins: 0,
    stalemateByMoves: 0,
    stalemateByPieces: 0,
    stalemateNoWhiteMoves: 0,
    stalemateNoBlackMoves: 0,
    end100moves: 0,
    castleKing: 0,
    castleQueen: 0,
    pawnPromotion: 0,
    enPassant: 0,
    averageMovesPerGame: 0,
  };

  while (gameCount < number) {
    console.log('Game Count: ', gameCount, '/', number);
    console.log(gameSummary);
    let gameEnded = false;
    gameSummary.games += 1;

    let board = [
      ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
      // [null, null, null, 'BK', null, null, null, null],
      // [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
    ];



    transcribeCount += transcribeBoard(board).length;
    encodeCount += encodeBoard(board).length;



    const pieceState = {
      hasMovedWK: false,
      hasMovedWKR: false,
      hasMovedWQR: false,
      hasMovedBK: false,
      hasMovedBKR: false,
      hasMovedBQR: false,
      canEnPassantW: '',
      canEnPassantB: '',
      countBlackPieces: 16,
      countWhitePieces: 16,
      capturedWhite: [],
      capturedBlack: [],
      lastCapture: 0,
      lastPawn: 0,
      moveCount: 0,
    };


    if (displayAll) {
      console.log('=== START GAME ===');
      displayFn(board);
    };

    let currentMoveWhite;
    let currentMoveBlack;
    let move;
    let newState;
    let moveCount = 1;

    while (!gameEnded) {
      if (displayAll) console.log(`=== [${moveCount}] WHITE MOVE ===`);
      currentMoveWhite = whiteMove(board, pieceState);
      move = currentMoveWhite[0];

      if (!Array.isArray(move)) {
        if (move.move === 'castle') {
          if (move.side === 'O-O') {
            gameSummary.castleKing += 1;
          } else {
            gameSummary.castleQueen += 1;
          }
        }
        if (move.move === 'enpassant') gameSummary.enPassant += 1;
        if (move.move === 'pawnPromotion') gameSummary.pawnPromotion += 1;
      }

      newState = currentMoveWhite[1];
      board = mutateBoard(board, move);

      /* DISPLAY BOARD   */

      !gameEnded && displayFn(board);

      transcribeCount += transcribeBoard(board).length;
      encodeCount += encodeBoard(board).length;

      /* END */

      if (isCheckmateWhite(board)) {
        gameEnded = true;
        console.log('**** WHITE CHECKMATE ***');
        gameSummary.whiteWins += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
      }
      if (isStalemateBlack(board)) {
        gameEnded = true;
        console.log('**** STALEMATE: BLACK CAN NOT MOVE ***', newState);
        gameSummary.stalemateNoBlackMoves += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
      }
      if ((newState.moveCount - newState.lastCapture > 50) &&
        (newState.moveCount - newState.lastPawn > 50)
      ) {
        gameEnded = true;
        console.log('**** STALEMATE BY MOVES ***', newState);
        gameSummary.stalemateByMoves += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
      }

      /*  ONE HUNDRED MOVES */

      if ((newState.moveCount >= 100)) {
        gameEnded = true;
        console.log('**** 100 Moves ***', newState);
        gameSummary.end100moves += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
      }

      /* END */

      if (newState.countBlackPieces + newState.countWhitePieces === 2) {
        gameEnded = true;
        console.log('**** STALEMATE BY PIECES ***', newState);
        gameSummary.stalemateByPieces += 1;
        gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
          (gameSummary.games - 1)) + newState.moveCount) /
          gameSummary.games;
        gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
      }

      if (!gameEnded) {
        currentMoveBlack = blackMove(board, newState);
        move = currentMoveBlack[0];

        if (!Array.isArray(move)) {
          if (move.move === 'castle') {
            if (move.side === 'O-O') {
              gameSummary.castleKing += 1;
            } else {
              gameSummary.castleQueen += 1;
            }
          }
          if (move.move === 'enpassant') gameSummary.enPassant += 1;
          if (move.move === 'pawnPromotion') gameSummary.pawnPromotion += 1;
        }

        newState = currentMoveBlack[1];
        board = mutateBoard(board, move);

        transcribeCount += transcribeBoard(board).length;
        encodeCount += encodeBoard(board).length;

        if (displayAll) console.log(`                             === [${moveCount}] BLACK MOVE ===`);
        !gameEnded && displayFn(board);
        if (isCheckmateBlack(board)) {
          gameEnded = true;
          console.log('**** BLACK CHECKMATE ***');
          gameSummary.blackWins += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        }
        if (isStalemateWhite(board)) {
          gameEnded = true;
          console.log('**** STALEMATE: WHITE CAN NOT MOVE ***', newState);
          gameSummary.stalemateNoWhiteMoves += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        }
        if ((newState.moveCount - newState.lastCapture > 50) &&
          (newState.moveCount - newState.lastPawn > 50)
        ) {
          gameEnded = true;
          console.log('**** STALEMATE BY MOVES ***', newState);
          gameSummary.stalemateByMoves += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        }


        /*  ONE HUNDRED MOVES */

        if ((newState.moveCount >= 100)) {
          gameEnded = true;
          console.log('**** 100 Moves ***', newState);
          gameSummary.end100moves += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        }

      /* END */


        if (newState.countBlackPieces + newState.countWhitePieces === 2) {
          gameEnded = true;
          console.log('**** STALEMATE BY PIECES ***', newState);
          gameSummary.stalemateByPieces += 1;
          gameSummary.averageMovesPerGame = ((gameSummary.averageMovesPerGame *
            (gameSummary.games - 1)) + newState.moveCount) /
            gameSummary.games;
          gameSummary.averageMovesPerGame = gameSummary.averageMovesPerGame.toFixed(2);
        }
      }

      moveCount += 1;
    }
    moveCount = 1;
    gameCount += 1;
  }

  console.log('Games Played:     ', gameCount);
  console.log('Transcribe Count: ', transcribeCount);
  console.log('Encode Count:     ', encodeCount);
  console.log('Data compression: ', 1 - (encodeCount / transcribeCount));
  console.log('Game summary:     ', gameSummary);
  return gameSummary;
};

const displayTranscribe = (board) => {
  console.log(transcribeBoard(board));
};

const displayEncode = (board) => {
  console.log(encodeBoard(board));
};

const displayFullBoard = (board) => {
  displayBoard(board);
};

// console.log(simulateGames(1000, false, displayFullBoard));
// console.log(simulateGames(1000, false, displayTranscribe));
// console.log(simulateGames(1000, false, displayEncode));

module.exports = {
  simulateGames,
  displayFullBoard,
  displayTranscribe,
  displayEncode,
  whiteMove,
  blackMove,
  mutateBoard,
};
