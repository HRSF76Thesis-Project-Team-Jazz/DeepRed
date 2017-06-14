
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

  const score = pieceScore(isEndGame);

  capturedWhite.forEach((piece) => { whiteScore += score[piece[1]]; });
  capturedBlack.forEach((piece) => { blackScore += score[piece[1]]; });

  return whiteScore - blackScore;
};

module.exports = {
  pieceScore,
  capturedPiecesScore,
};
