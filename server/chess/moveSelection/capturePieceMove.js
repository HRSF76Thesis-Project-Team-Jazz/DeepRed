const chessEval = require('../chessEval');
const chessEncode = require('../chessEncode');
const safeMoves = require('../deepRed/safeMoves');
const chessMoves = require('../chessMoves');

const { boardPiecesScore } = chessEval;
const { decodeWithState, encodeWithState } = chessEncode;
const { getEncodedSafeMoves } = safeMoves;
const { evalMove } = chessMoves;

const choosePieceCapture = (encodedParentBoard, color) => {
  const parentWithState = decodeWithState(encodedParentBoard);
  const board = parentWithState[0];
  const state = parentWithState[1];
  const selector = (color === 'W') ? 'blackScore' : 'whiteScore';

  const parentPiecesScore = boardPiecesScore(board);
  const startScore = parentPiecesScore[selector];

  let lowScore = startScore;
  let lowBoard;
  const encodedSafeMoves = getEncodedSafeMoves(board, state, color);

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

  if (lowScore === startScore) {
    lowBoard = encodedSafeMoves[Math.floor(Math.random() * encodedSafeMoves.length)];
  }

  return evalMove(encodedParentBoard, lowBoard, color);
};

module.exports = {
  choosePieceCapture,
};

// const pieceState = {
//   hasMovedWK: false,
//   hasMovedWKR: false,
//   hasMovedWQR: false,
//   hasMovedBK: false,
//   hasMovedBKR: false,
//   hasMovedBQR: false,
//   canEnPassantW: '',
//   canEnPassantB: '',
// };

// const board = [
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, null, null, null, null, null, null],
//   [null, null, 'BN', null, 'BR', null, null, null],
//   [null, null, null, null, null, null, null, null],
//   ['WP', null, null, 'WP', null, null, 'WP', 'WP'],
//   [null, null, null, null, null, null, null, null],
// ];

// const encoded = encodeWithState(board, pieceState);
// console.log(encoded);
// console.log(choosePieceCapture(encoded, 'W'));
