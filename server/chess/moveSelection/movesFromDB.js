const chessEncode = require('../chessEncode');
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

const {
  transcribeBoard,
  encodeBoard,
  encodeWithState,
  decodeWithState,
} = chessEncode;

const getBestMoveFromDB = (encodedBoardWithState, color) => {

  // 1) Determine which table to query based on [color]  
  // 2) Query DB where parent = encodedBoardWithState
  //    => [DB] return array of valid moves
  // 3) If moves exist, choose the best move:
  //    => highest win percentage for [color]

  //  Note: 2 & 3 may be combined in a database operation
  //        find(parent = encodedBoardWithState, sortBy: win%) => take one

  // 4) If no moves exist or if win % is zero => select a new random move

  // return newBoardWithState;
};

const getNewMove = (encodedBoardWithState, color) => {

  const boardWithState = decodeWithState(encodeBoard);
  const board = boardWithState[0];
  const state = boardWithState[1];

  const moves = (color === 'W') ? getSafeMovesWhite(board, state) : getSafeMovesBlack(board, state);

  const movesList = [];
  
  const keys = Object.keys(moves);



  

  // 1) Determine which table to query
  // 2) Query DB where parent = encodedBoardWithState
  //    => [DB] return an array of new BoardsWithState only
  // 3) Get list of safe available moves
  // 4) Filter out safe moves that are not in the DB query
  // 5) Return a random result from the remaining available moves

};
