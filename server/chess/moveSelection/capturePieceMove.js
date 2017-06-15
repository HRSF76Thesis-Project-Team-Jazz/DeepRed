const chessEval = require('../chessEval');
const chessEncode = require('../chessEncode');
const safeMoves = require('../deepRed/safeMoves');
const chessMoves = require('../chessMoves');

const { boardPiecesScore } = chessEval;
const { decodeWithState } = chessEncode;
const { getEncodedSafeMoves } = safeMoves;
const { evalMove } = chessMoves;

/**
 * Chooses move that captures the highest value piece
 * If no piece capture is available, random move is selected
 * @param {string} encodedParentBoard : encoded board + state
 * @param {*} color : 'W' : 'B'
 * @return {array/object} selected move in deep red move notation
 */

const choosePieceCapture = (encodedParentBoard, color, successFn, noneFn) => {
  const parentWithState = decodeWithState(encodedParentBoard);
  const board = parentWithState[0];
  const state = parentWithState[1];
  const selector = (color === 'W') ? 'blackScore' : 'whiteScore';

  const parentPiecesScore = boardPiecesScore(board);
  const startScore = parentPiecesScore[selector];

  let lowScore = startScore;
  let lowBoard;
  const encodedSafeMoves = getEncodedSafeMoves(board, state, color);

  // 1) If capturing piece moves to a safe position

  // 2) If capturing piece <= captured piece

  encodedSafeMoves.forEach((encodedBoard) => {
    const boardWithState = decodeWithState(encodedBoard);
    const newBoard = boardWithState[0];
    const newBoardScore = boardPiecesScore(newBoard);
    const newScore = newBoardScore[selector];

    if (newScore < lowScore) {
      lowScore = newScore;
      lowBoard = encodedBoard;
    }
  });

  if (lowScore < startScore) {
    console.log('** CHOOSE PIECE CAPTURE');
    successFn(evalMove(encodedParentBoard, lowBoard, color));
  } else {
    noneFn();
  }
};

module.exports = {
  choosePieceCapture,
};
