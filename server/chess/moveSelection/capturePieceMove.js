const chessEval = require('../chessEval');
const chessEncode = require('../chessEncode');
const safeMoves = require('../deepRed/safeMoves');
const chessMoves = require('../chessMoves');

const { boardPiecesScore, piecesAttacked } = chessEval;
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

  let bestBoard;
  let bestValue = 0;
  const encodedSafeMoves = getEncodedSafeMoves(board, state, color);

  const parentAttackedScore = piecesAttacked(board, color);

  encodedSafeMoves.forEach((encodedBoard) => {
    const boardWithState = decodeWithState(encodedBoard);
    const newBoard = boardWithState[0];
    const newBoardScore = boardPiecesScore(newBoard);
    const newScore = newBoardScore[selector];
    const boardAttackedScore = piecesAttacked(board, color);

    const valueOfAddedRisk = boardAttackedScore - parentAttackedScore;
    const valueOfCapturedPiece = startScore - newScore;
    const moveValue = valueOfCapturedPiece - valueOfAddedRisk;

    if (moveValue > bestValue) {
      bestValue = moveValue;
      bestBoard = encodedBoard;
    }
  });

  if (bestValue > 0) {
    console.log('** CHOOSE PIECE CAPTURE');
    successFn(evalMove(encodedParentBoard, bestBoard, color));
  } else {
    noneFn();
  }
};

module.exports = {
  choosePieceCapture,
};

