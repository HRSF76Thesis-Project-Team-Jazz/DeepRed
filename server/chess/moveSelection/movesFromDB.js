const chessEncode = require('../chessEncode');
const safeMoves = require('../deepRed/safeMoves');
const chessDB = require('../../chessDB');
const chessMoves = require('../chessMoves');
const capturePieceMove = require('./capturePieceMove');

const { getEncodedSafeMoves } = safeMoves;
const { decodeWithState } = chessEncode;
const { getMovesFromDB } = chessDB;
const { evalMove } = chessMoves;
const { choosePieceCapture } = capturePieceMove;

/**
 * Input a current board and state and find a move that DeepRed has not seen before (not in DB)
 * @param {string} encodedParentBoard : encoded board with state
 * @param {string} color : 'W' or 'B', current player's move
 * @param {function} callback : function that executes on the return move
 *                       callback(move) where move is a Deep Red format move
 */

const chooseNewMove = (encodedParentBoard, color, callback) => {
  const boardWithState = decodeWithState(encodedParentBoard);
  const board = boardWithState[0];
  const state = boardWithState[1];

  const encodedSafeMoves = getEncodedSafeMoves(board, state, color);

  const moveFound = (moves) => {
    let newEncodedBoard;
    if (encodedSafeMoves.length === moves.length) {
      console.log('** ALL MOVES IN DB: CHOOSE RANDOM');
      newEncodedBoard = encodedSafeMoves[Math.floor(Math.random() * encodedSafeMoves.length)];
    } else {
      console.log('** CHOOSE A NEW MOVE NOT IN DB');
      const dbMoves = moves.map(move => move.board);
      const newMoves = encodedSafeMoves.filter(move => dbMoves.indexOf(move) === -1);
      newEncodedBoard = newMoves[Math.floor(Math.random() * newMoves.length)];
    }
    callback(evalMove(encodedParentBoard, newEncodedBoard, color));
  };

  const moveNotFound = () => {
    console.log('** PARENT NOT IN DB: CHOOSE NEW RANDOM MOVE');
    callback(evalMove(encodedParentBoard,
      encodedSafeMoves[Math.floor(Math.random() * encodedSafeMoves.length)], color));
  };

  choosePieceCapture(encodedParentBoard, color, callback);
};

/**
 * Input a current board and state and find the best move available.
 * If no such move exists in the database, a random move is selected
 * @param {string} encodedParentBoard : encoded board with state
 * @param {string} color : 'W' or 'B', current player's move
 * @param {function} callback : function that executes on the return move
 *                       callback(move) where move is a Deep Red format move
 */

const chooseBestMoveFromDB = (encodedParentBoard, color, callback) => {
  const moveFound = (moves) => {
    console.log('** MOVE CHOSEN FROM DB');
    callback(evalMove(encodedParentBoard, moves[0].board, color));
  };

  const moveNotFound = () => {
    console.log('** move not found **');
    chooseNewMove(encodedParentBoard, color, callback);
  };

  getMovesFromDB(encodedParentBoard, color, moveFound, moveNotFound);
};

module.exports = {
  chooseBestMoveFromDB,
};
