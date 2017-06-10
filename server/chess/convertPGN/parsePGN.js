const chessEval = require('../chessEval');
const deepRed = require('../deepRed');

const { transcribeBoard } = chessEval;
const { findPiecePosition, mutateBoard } = deepRed.basic;
const { getAllMovesWhite } = deepRed.movesWhite;
const { getAllMovesBlack } = deepRed.movesBlack;
const { displayBoard } = deepRed.display;

const convertToArray = (pgn) => {
  let array = pgn.split('+').join('');
  array = array.split('x').join('').split(' ');

  array = array.map((x) => {
    const subArray = x.split('.');
    if (subArray.length === 1) return subArray[0];
    return subArray[1];
  });

  return array.filter(x => x !== '');
};

const transcribeMove = (moveString, color, board) => {
  if (moveString === 'O-O') return { move: 'castle', color, side: 'O-O' };
  if (moveString === 'O-O-O') return { move: 'castle', color, side: 'O-O-O' };

  const cols = {
    a: 0,
    b: 1,
    c: 2,
    d: 3,
    e: 4,
    f: 5,
    g: 6,
    h: 7,
  };

  // Pawn Promotion
  if (moveString.indexOf('=') >= 0) {
    const split = moveString.split('=');
    const piece = split[1];

    const direction = (color === 'W') ? 1 : -1;
    const toRow = (color === 'W') ? 0 : 7;

    const from = `${toRow + (direction * 1)}${cols[split[0][0]]}`;
    const to = `${toRow}${cols[split[0][0]]}`;
    const newPiece = `${color}${piece[0]}`;
    return { move: 'pawnPromotion', from, to, newPiece };
  }

  // King
  if (moveString[0] === 'K') {
    const piecePosition = findPiecePosition(`${color}K`, board)[0];
    const toPosition = moveString.substring(1);
    const toRow = 8 - toPosition[1];
    const toCol = cols[toPosition[0]];
    return [piecePosition, [toRow, toCol]];
  }

  // Queen
  if (moveString[0] === 'Q') {
    const piecePosition = findPiecePosition(`${color}Q`, board)[0];
    const toPosition = moveString.substring(1);
    const toRow = 8 - toPosition[1];
    const toCol = cols[toPosition[0]];
    return [piecePosition, [toRow, toCol]];
  }

  const moves = (color === 'W') ? getAllMovesWhite(board) : getAllMovesBlack(board);

  const piece = `${color}${(cols[moveString[0]]) ? 'P' : moveString[0]}`;
  const piecePosition = findPiecePosition(piece, board);
  let keys = piecePosition.map(x => x.join(''));

  let toPosition = (piece[1] !== 'P') ? moveString.substring(1) : moveString;

  if (cols[toPosition[1]]) {
    keys = keys.filter(x => +x[1] === cols[toPosition[0]]);
    toPosition = toPosition.substring(1);
  }

  const toRow = 8 - toPosition[1];
  const toCol = cols[toPosition[0]];

  const searchVal = JSON.stringify([toRow, toCol]);

  for (let i = 0; i < keys.length; i += 1) {
    const index = moves[keys[i]].map(x => JSON.stringify(x)).indexOf(searchVal);
    if (index >= 0) return [keys[i], [toRow, toCol].join('')];
  }
};


/**
 *    TESTING
 */

const game = '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Bd6 5. Bc6 dc6 6. d4 Bg4 7. Qd3 Bf3 8. gf3 Nh5 9. Nc3 ed4 10. Ne2 Qh4 11. Ng3 O-O 12. Qd4 Rfd8 13. Qc3 Ng3 14. fg3 Bg3 15. hg3 Qg3 16. Kh1 Rd6 17. Qe1 Qh3 18. Kg1 Rg6 19. Kf2 Rg2 20. Ke3 f5 21. e5 Rc2 22. Bd2 Rd8 23. Bc3 f4 24. Kf4 Qh6 25. Ke4 Qg6 26. Kf4 Qh6 27. Ke4 Rh2 28. Rd1 Rh4 29. f4 Qg6 30. Ke3 Rh3 31. Rf3 Rf3 32. Kf3 Rd1 33. Qe2 Rd3';

let board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];

const gameArray = convertToArray(game);

for (let i = 0; i < gameArray.length; i += 1) {
  console.log(`**** [${Math.floor(i / 2) + 1}] ${gameArray[i]} ****`);
  const move = transcribeMove(gameArray[i], (i % 2 === 0) ? 'W' : 'B', board);
  console.log(move);
  board = mutateBoard(board, move);
  displayBoard(board);
}

// console.log(transcribeMove('exf4', 'W', board));
// console.log(transcribeMove('e8=Q', 'W', board));
// console.log(transcribeMove('e8=Q#', 'W', board));
// console.log(transcribeMove('e1=Q#', 'B', board));
// console.log(transcribeMove('Kh6', 'W', board));
// console.log(transcribeMove('Qh6', 'W', board));
// console.log(transcribeMove('O-O', 'W', board));
// console.log(transcribeMove('O-O-O', 'W', board));
// console.log(transcribeMove('Rh2', 'W', board));
// console.log(transcribeMove('e4', 'W', board));
