

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

/**
 * Return the position (first occurring) for the input piece
 * @param {string} piece
 * @param {array} board
 * @return {array} : coordinates of piece [row, col]
 */

const findPiecePosition = (piece, board) => {
  if (piece[0] === 'B') {
    for (let row = 0; row < 8; row += 1) {
      for (let col = 0; col < 8; col += 1) {
        if (board[row][col] === piece) return [row, col];
      }
    }
  } else {
    for (let row = 7; row >= 0; row -= 1) {
      for (let col = 0; col < 8; col += 1) {
        if (board[row][col] === piece) return [row, col];
      }
    }
  }

  return undefined;
};

const boardPositionScore = (board) => {
  let whiteScore = 0;
  let blackScore = 0;

  const whiteKing = findPiecePosition('WK', board);
  const blackKing = findPiecePosition('BK', board);

  const positionWeight = [
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.1, 1],
    [1, 1.1, 1.3, 1.3, 1.3, 1.3, 1.1, 1],
    [1, 1.1, 1.3, 1.3, 1.3, 1.3, 1.1, 1],
    [1, 1.1, 1.2, 1.2, 1.2, 1.2, 1.1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
    [1, 1, 1, 1, 1, 1, 1, 1],
  ];

};



module.exports.capturedPiecesScore = capturedPiecesScore;
module.exports.findPiecePosition = findPiecePosition;
module.exports.boardPositionScore = boardPositionScore;
