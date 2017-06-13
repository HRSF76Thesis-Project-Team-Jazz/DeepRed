const safeMoves = require('./deepRed/safeMoves');
const basic = require('./deepRed/basic');
const chessEncode = require('./chessEncode');
const pieceState = require('./pieceState');

const {
  encodeWithState,
  decodeWithState,
} = chessEncode;

const { mutateBoard } = basic;

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const { evalPieceState } = pieceState;

/**
 * Input a parent board and new board and return the move that resulted in the change
 * @param {string} encodedParentBoard : parent board with state
 * @param {string} encodedNewBoard : new board with state
 * @param {string} color : 'W' or 'B'
 */

const evalMove = (encodedParentBoard, encodedNewBoard, color) => {
  const parentBoardWithState = decodeWithState(encodedParentBoard);
  const parentBoard = parentBoardWithState[0];
  const parentState = parentBoardWithState[1];

  const moves = (color === 'W') ?
    getSafeMovesWhite(parentBoard, parentState) : getSafeMovesBlack(parentBoard, parentState);

  if (moves.specialMoves) {
    for (let i = 0; i < moves.specialMoves.length; i += 1) {
      const newBoard = mutateBoard(parentBoard, moves.specialMoves[i]);
      const newState = evalPieceState(parentBoard, moves.specialMoves[i], color, parentState);
      if (encodeWithState(newBoard, newState) === encodedNewBoard) return moves.specialMoves[i];
    }
  }

  const keys = Object.keys(moves).filter(x => x !== 'specialMoves');

  for (let i = 0; i < keys.length; i += 1) {
    const movesArray = moves[keys[i]];
    for (let j = 0; j < movesArray.length; j += 1) {
      const move = [keys[i], movesArray[j]];
      const newBoard = mutateBoard(parentBoard, move);
      const newState = evalPieceState(parentBoard, move, color, parentState);
      if (encodeWithState(newBoard, newState) === encodedNewBoard) return move;
    }
  }

  return null;
};

module.exports = {
  evalMove,
};
