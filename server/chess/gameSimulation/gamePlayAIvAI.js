const endGameChecks = require('../deepRed/endGameChecks');
const basic = require('../deepRed/basic');
const chessEncode = require('../chessEncode');
const { whiteMove, blackMove } = require('./gamePlay');

const { transcribeBoard, encodeBoard } = chessEncode;

const { mutateBoard } = basic;

const {
  isCheckmateWhite,
  isCheckmateBlack,
  isStalemateWhite,
  isStalemateBlack,
} = endGameChecks;

const MAX_GAME_LENGTH = 200;

const simulateGamesAIvAI = (number, displayAll, callback) => {
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

  while (gameSummary.whiteWins + gameSummary.blackWins < number) {
    console.log('Game Count: ', gameCount, '/', number);
    console.log(gameSummary);
    let gameEnded = false;
    gameSummary.games += 1;

    let board = [
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
      // [null, null, null, 'BK', null, null, null, null],
      // [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
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
      callback({ board, pieceState });
    }

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

      const whiteState = Object.assign({}, currentMoveWhite[1]);
      newState = currentMoveWhite[1];
      board = mutateBoard(board, move);

      /* DISPLAY BOARD   */

      !gameEnded && callback({ board, pieceState: whiteState });

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

      if ((newState.moveCount >= MAX_GAME_LENGTH)) {
        gameEnded = true;
        console.log(`**** Max Moves ${MAX_GAME_LENGTH} ***`, newState);
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

        const blackState = Object.assign({}, currentMoveBlack[1]);
        console.log(blackState);
        newState = currentMoveBlack[1];
        board = mutateBoard(board, move);

        transcribeCount += transcribeBoard(board).length;
        encodeCount += encodeBoard(board).length;

        if (displayAll) console.log(`                             === [${moveCount}] BLACK MOVE ===`);
        !gameEnded && callback({ board, pieceState: blackState });
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

        if ((newState.moveCount >= MAX_GAME_LENGTH)) {
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
const simulateWinningGameAIvAI = (number, displayAll) => {
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
  const winningGames = [];
  let currentGame = [];
  while (winningGames.length < number) {
    let gameEnded = false;
    gameSummary.games += 1;
    currentGame = [];
    let board = [
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
      ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
      // [null, null, null, 'BK', null, null, null, null],
      // [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
      ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
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
      currentGame.push({
        board,
        blackCapPieces: pieceState.capturedBlack.slice(0),
        whiteCapPieces: pieceState.capturedWhite.slice(0),
      });
    }

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

      const whiteState = Object.assign({}, currentMoveWhite[1]);
      newState = currentMoveWhite[1];
      board = mutateBoard(board, move);

      /* DISPLAY BOARD   */

      !gameEnded && currentGame.push({
        board,
        blackCapPieces: whiteState.capturedBlack.slice(0),
        whiteCapPieces: whiteState.capturedWhite.slice(0),
      });

      transcribeCount += transcribeBoard(board).length;
      encodeCount += encodeBoard(board).length;

      /* END */

      if (isCheckmateWhite(board)) {
        gameEnded = true;
        winningGames.push(currentGame);
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

      if ((newState.moveCount >= MAX_GAME_LENGTH)) {
        gameEnded = true;
        console.log(`**** Max Moves ${MAX_GAME_LENGTH} ***`, newState);
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

        const blackState = Object.assign({}, currentMoveBlack[1]);
        console.log(blackState);
        newState = currentMoveBlack[1];
        board = mutateBoard(board, move);

        transcribeCount += transcribeBoard(board).length;
        encodeCount += encodeBoard(board).length;

        if (displayAll) console.log(`                             === [${moveCount}] BLACK MOVE ===`);
        !gameEnded && currentGame.push({
          board,
          blackCapPieces: blackState.capturedBlack.slice(0),
          whiteCapPieces: blackState.capturedWhite.slice(0),
        });
        if (isCheckmateBlack(board)) {
          winningGames.push(currentGame);
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

        if ((newState.moveCount >= MAX_GAME_LENGTH)) {
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
  return { winningGames, gameSummary };
};

module.exports = {
  simulateGamesAIvAI,
  simulateWinningGameAIvAI,
  mutateBoard,
};
