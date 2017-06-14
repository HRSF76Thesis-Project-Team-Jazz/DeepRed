
const pieceScore = isEndGame => ({
  P: (!isEndGame) ? 2 : 3.75,
  N: 9.25,
  B: 9.75,
  R: 15,
  Q: 23.75,
  K: (!isEndGame) ? 2 : 6.5,
});

/**
 * Keep track of relative captured pieces score
 * Assign numerical values to pieces and compare players' captures
 * @param {array} capturedWhite : black pieces captured by white player
 * @param {array} capturedBlack : white pieces captured by black player
 * @return {float}    (+) = white advantage
 *                    (-) = black advantage
 */

const capturedPiecesScore = (capturedWhite, capturedBlack) => {
  let whiteScore = 0;
  let blackScore = 0;
  const isEndGame = (capturedWhite.length + capturedBlack.length) >= 16;

  const value = pieceScore(isEndGame);

  capturedWhite.forEach((piece) => { whiteScore += value[piece[1]]; });
  capturedBlack.forEach((piece) => { blackScore += value[piece[1]]; });

  return whiteScore - blackScore;
};


/**
 * Return the value of each player's pieces on the board
 * @param {array} board
 * @return {object} { whiteScore, blackScore }
 */

const boardPiecesScore = (board) => {
  const whitePieces = [];
  const blackPieces = [];

  board.forEach(row =>
    row.forEach(col =>
      ((col[0] === 'W') ? whitePieces.push(col) : blackPieces.push(col))));

  const value = pieceScore((whitePieces.length + blackPieces.length) < 12);

  let whiteScore = 0;
  let blackScore = 0;

  whitePieces.forEach((piece) => { whiteScore += value[piece[1]]; });
  blackPieces.forEach((piece) => { blackScore += value[piece[1]]; });

  return {
    whiteScore,
    blackScore,
  };
};

module.exports = {
  pieceScore,
  capturedPiecesScore,
  boardPiecesScore,
};
