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

  const parentPiecesScore = Object.assign({}, boardPiecesScore(board));
  const startScore = parentPiecesScore[selector];

  let bestBoard;
  let bestValue;
  let bestCaptured;
  let lowestRiskScore;

  const encodedSafeMoves = getEncodedSafeMoves(board, state, color).sort((a, b) => Math.random() - Math.random());

  const parentAttackedScore = piecesAttacked(board, state, color);
  console.log('*** parentPiecesScore: ', parentPiecesScore);
  console.log('*** START SCORE: ', startScore);
  console.log('*** PARENT ATTACKED SCORE: ', parentAttackedScore);

  encodedSafeMoves.forEach((encodedBoard) => {
    const boardWithState = decodeWithState(encodedBoard);
    const newBoard = boardWithState[0];
    const newState = boardWithState[1];
    const newBoardScore = Object.assign({}, boardPiecesScore(newBoard));
    const newScore = newBoardScore[selector];
    const boardAttackedScore = piecesAttacked(board, newState, color);

    const valueOfAddedRisk = boardAttackedScore - parentAttackedScore;
    const valueOfCapturedPiece = startScore - newScore;
    const moveValue = valueOfCapturedPiece - valueOfAddedRisk;

    if (!bestValue || moveValue > bestValue) {
      console.log('****************** SAVE FIRST', moveValue, bestValue);
      bestValue = moveValue;
      bestBoard = encodedBoard;
      lowestRiskScore = valueOfAddedRisk;
    } else if (bestValue === moveValue && (!bestCaptured || (valueOfCapturedPiece > bestCaptured))) {
      bestValue = moveValue;
      bestBoard = encodedBoard;
      bestCaptured = valueOfCapturedPiece;
    }
  });

  console.log('===== BEST CAPTURE =====');
  console.log('startScore | newScore | attackedScore | newAttackedScore', startScore, parentAttackedScore);
  console.log('moveValue: ', bestValue);
  console.log('valueOfAddedRisk: ', lowestRiskScore);
  console.log('valueOfCapturedPiece: ', bestCaptured);
  console.log();
  console.log();

  successFn(evalMove(encodedParentBoard, bestBoard, color));
};

module.exports = {
  choosePieceCapture,
};

