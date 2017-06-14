const chessEval = require('../chessEval');
const chessEncode = require('../chessEncode');
const safeMoves = require('./deepRed/safeMoves');

const { pieceScore } = chessEval;

const {
  encodeWithState,
  decodeWithState,
} = chessEncode;

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
  getEncodedSafeMoves,
} = safeMoves;

const choosePieceCapture = (encodedParentBoard, color) => {
  const parentWithState = decodeWithState(encodedParentBoard);
  const board = parentWithState[0];
  const state = parentWithState[1];

}
