const chessEncode = require('../chessEncode');
const safeMoves = require('../deepRed/safeMoves');
const pieceState = require('../pieceState');
const display = require('../deepRed/display');
const basic = require('../deepRed/basic');

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
  getEncodedSafeMoves,
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

  const boardWithState = decodeWithState(encodedBoardWithState);
  const board = boardWithState[0];
  const state = boardWithState[1];

  const encodedSafeMoves = getEncodedSafeMoves(board, state, color);

  // 1) Determine which table to query
  // 2) Query DB where parent = encodedBoardWithState
  //    => [DB] return an array of new BoardsWithState only
  // 3) Get list of safe available moves
  // 4) Filter out safe moves that are not in the DB query
  // 5) Return a random result from the remaining available moves

  const sampleDBmoves = [
    '7R89R7M_JnAXG2R34R2|000000',
    '7R89R7M_JfAfG2R34R2|000000`',
    '7R89R7M_JoAVA_F2R34R2|000000',
    '7R89R7M_JgAdA_F2R34R2|000000a',
    '7R89R7M_JpAUB_E2R34R2|000000',
    '7R89R7M_JhAcB_E2R34R2|000000b',
    '7R89R7M_JqATC_D2R34R2|000000',
    '7R89R7M_JiAbC_D2R34R2|000000c',
    '7R89R7M_JrASD_C2R34R2|000000',
    '7R89R7M_JjAaD_C2R34R2|000000d',
    '7R89R7M_JsARE_B2R34R2|000000',
    '7R89R7M_JkAZE_B2R34R2|000000e',
    '7R89R7M_JtA_F_A2R34R2|000000',
    '7R89R7M_JlAYF_A2R34R2|000000f',
    '7R89R7M_JuH_2R34R2|000000',
    '7R89R7M_JmAXG_2R34R2|000000g',
    '7R89R7M_JvH_2_34R2|001000',
    '7R89R7M_JvHR234R2|001000',
    '7R89R7M_JvH2_3_4R2|000000',
    '7R89R7M_JvH23R4R2|000000',
    '7R89R7M_JvH2R3_4_2|100000',
    '7R89R7M_JvH2R34_2|010000',
    '7R89R7M_JvH2R342|010000',
    '7R89R7M_JvH2R3_24|110000',
  ];

  const newMoves = encodedSafeMoves.filter(move => sampleDBmoves.indexOf(move) === -1);

  if (newMoves.length > 0) return newMoves[Math.floor(Math.random() * newMoves.length)];
  return encodedSafeMoves[Math.floor(Math.random() * encodedSafeMoves.length)];
};
