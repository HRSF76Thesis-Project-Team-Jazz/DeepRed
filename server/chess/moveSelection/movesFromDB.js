const chessEncode = require('../chessEncode');
const safeMoves = require('../deepRed/safeMoves');
const chessDB = require('../../chessDB');
const chessMoves = require('../chessMoves');

const {
  getEncodedSafeMoves,
} = safeMoves;


const {
  decodeWithState,
} = chessEncode;

const {
  getMovesFromDB,
} = chessDB;

const { evalMove } = chessMoves;


const chooseNewMove = (encodedParentBoard, color, callback) => {
  const boardWithState = decodeWithState(encodedParentBoard);
  const board = boardWithState[0];
  const state = boardWithState[1];

  const encodedSafeMoves = getEncodedSafeMoves(board, state, color);

  const moveFound = (moves) => {
    let newEncodedBoard;
    if (encodedSafeMoves.length === moves.length) {
      newEncodedBoard = encodedSafeMoves[Math.floor(Math.random() * encodedSafeMoves.length)];
    } else {
      const dbMoves = moves.map(move => move.board);
      const newMoves = encodedSafeMoves.filter(move => dbMoves.indexOf(move) === -1);
      newEncodedBoard = newMoves[Math.floor(Math.random() * newMoves.length)];
    }
    callback(evalMove(encodedParentBoard, newEncodedBoard, color));
  };

  const moveNotFound = () => {
    console.log('** move not found **');
    return evalMove(encodedParentBoard,
      encodedSafeMoves[Math.floor(Math.random() * encodedSafeMoves.length)], color);
  };

  return getMovesFromDB(encodedParentBoard, color, moveFound, moveNotFound);
};

const chooseBestMoveFromDB = (encodedParentBoard, color, callback) => {

  const moveFound = (moves) => {
    callback(evalMove(encodedParentBoard, moves[0].board, color));
  };

  const moveNotFound = () => {
    console.log('** move not found **');
    chooseNewMove(encodedParentBoard, color, callback);
  };

  return getMovesFromDB(encodedParentBoard, color, moveFound, moveNotFound);
};

chooseBestMoveFromDB('75689657PvH20134102|000000', 'W', console.log);
chooseNewMove('75689657PvH20134102|000000', 'W', console.log);
