
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

const transcribeBoard = board => board.map((row) => {
  const pieceIndex = {
    null: 0,
    WP: 1,
    WN: 2,
    WB: 3,
    WR: 4,
    WQ: 5,
    WK: 6,
    BP: 'a',
    BN: 'b',
    BB: 'c',
    BR: 'd',
    BQ: 'e',
    BK: 'f',
  };
  const newRow = row.map(col => pieceIndex[col]);
  return newRow.join('');
}).join('');

module.exports = {
  capturedPiecesScore,
  transcribeBoard,
};

const code = {
  WN: '0',
  WB: '1',
  WR: '2',
  WQ: '3',
  WK: '4',
  BN: '5',
  BB: '6',
  BR: '7',
  BQ: '8',
  BK: '9',
  WP1: 'A',
  WP2: 'B',
  WP3: 'C',
  WP4: 'D',
  WP5: 'E',
  WP6: 'F',
  WP7: 'G',
  WP8: 'H',
  BP1: 'I',
  BP2: 'J',
  BP3: 'K',
  BP4: 'L',
  BP5: 'M',
  BP6: 'N',
  BP7: 'O',
  BP8: 'P',
  _: 'Q',
  _2: 'R',
  _3: 'S',
  _4: 'T',
  _5: 'U',
  _6: 'V',
  _7: 'W',
  _8: 'X',
  _9: 'Y',
  _10: 'Z',
  _11: 'a',
  _12: 'b',
  _13: 'c',
  _14: 'd',
  _15: 'e',
  _16: 'f',
  _17: 'g',
  _18: 'h',
  _19: 'i',
  _20: 'j',
  _21: 'k',
  _22: 'l',
  _23: 'm',
  _24: 'n',
  _25: 'o',
  _26: 'p',
  _27: 'q',
  _28: 'r',
  _29: 's',
  _30: 't',
  _31: 'u',
  _32: 'v',
  _33: 'w',
  _34: 'x',
  _35: 'y',
  _36: 'z',
  _37: '!',
  _38: '{',
  _39: '#',
  _40: '$',
  _41: '%',
  _42: '&',
  _43: '(',
  _44: ')',
  _45: '*',
  _46: '+',
  _47: ',',
  _48: '-',
  _49: '.',
  _50: '/',
  _51: ':',
  _52: ';',
  _53: '<',
  _54: '=',
  _55: '>',
  _56: '?',
  _57: '@',
  _58: '[',
  _59: '|',
  _60: ']',
  _61: '^',
  _62: '_',
};

const encodeBoard = (board) => {
  const boardArray = [].concat.apply([], board);
  console.log(boardArray);

  let currentPiece = '';
  let count = 0;
  let result = '';

  boardArray.forEach((input) => {
    const piece = (input === null) ? '_' : input;

    if (piece === currentPiece) {
      count += 1;
    } else if (count > 0) {
      console.log(currentPiece + count, code[currentPiece + count]);
      result += code[currentPiece + count];
      currentPiece = (['WP', 'BP', '_'].indexOf(piece) >= 0) ? piece : '';
      count = (['WP', 'BP', '_'].indexOf(piece) >= 0) ? 1 : 0;
    } else if (['WP', 'BP', '_'].indexOf(piece) === -1) {
      result += code[piece];
    } else {
      currentPiece = piece;
      count += 1;
    }
  });

  if (count > 0) result += code[currentPiece + count];

  return result;
};

const decodeBoard = (code) => {
}

const board = [
  ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];

console.log(encodeBoard(board));
