const chessEncode = require('../chessEncode');
const deepRed = require('../deepRed');
const chessDB = require('../../chessDB');

const { encodeWithState, decodeWithState } = chessEncode;
const { findPiecePosition, mutateBoard } = deepRed.basic;
const { getAllMovesWhite } = deepRed.movesWhite;
const { getAllMovesBlack } = deepRed.movesBlack;
const { displayBoard } = deepRed.display;
const { saveDeepRedWhite, saveDeepRedBlack } = chessDB;

const convertToArray = (pgn) => {
  let array = pgn.split('+').join('');
  array = array.split('x').join('').split(' ');

  array = array.map((x) => {
    const subArray = x.split('.');
    if (subArray.length === 1) return subArray[0];
    return subArray[1];
  });

  array = array.filter(x => x !== '');
  // const last = array[array.length - 1];
  // if (last === '1-0') console.log('** WINNER: WHITE **');
  // if (last === '0-1') console.log('** WINNER: BLACK **');
  // if (['1-0', '0-1'].indexOf(array[array.length - 1]) >= 0) array.pop();

  return array.filter(x => x !== '');
};

const transcribeMove = (moveString, color, board, pieceState) => {
  if (moveString.indexOf('#') >= 0) console.log(`Winner: ${color}`);

  const newState = Object.assign({}, pieceState, { canEnPassantW: '', canEnPassantB: '' });

  if (moveString === 'O-O' || moveString === 'O-O-O') {
    const side = moveString;
    if (color === 'W') {
      newState.hasMovedWK = true;
      if (side === 'O-O') {
        newState.hasMovedWKR = true;
      } else {
        newState.hasMovedWQR = true;
      }
    } else {
      newState.hasMovedBK = true;
      if (side === 'O-O') {
        newState.hasMovedBKR = true;
      } else {
        newState.hasMovedBQR = true;
      }
    }

    return {
      move: { move: 'castle', color, side },
      newState,
    };
  }

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
    return {
      move: { move: 'pawnPromotion', from, to, newPiece },
      newState,
    };
  }

  // King
  if (moveString[0] === 'K') {
    const piecePosition = findPiecePosition(`${color}K`, board)[0];
    const toPosition = moveString.substring(1);
    const toRow = 8 - toPosition[1];
    const toCol = cols[toPosition[0]];

    newState.hasMovedWK = (color === 'W') ? true : newState.hasMovedWK;
    newState.hasMovedBK = (color === 'B') ? true : newState.hasMovedBK;

    return {
      move: [piecePosition, [toRow, toCol]],
      newState,
    };
  }

  // Queen
  if (moveString[0] === 'Q') {
    const piecePosition = findPiecePosition(`${color}Q`, board)[0];
    const toPosition = moveString.substring(1);
    const toRow = 8 - toPosition[1];
    const toCol = cols[toPosition[0]];
    return {
      move: [piecePosition, [toRow, toCol]],
      newState,
    };
  }

  const moves = (color === 'W') ? getAllMovesWhite(board) : getAllMovesBlack(board);

  const piece = `${color}${(cols[moveString[0]] || cols[moveString[0]] === 0) ? 'P' : moveString[0]}`;
  const piecePosition = findPiecePosition(piece, board);

  let keys = piecePosition.map(x => x.join(''));

  let toPosition = (piece[1] !== 'P') ? moveString.substring(1) : moveString;
  let originCol;

  if (cols[toPosition[1]]) {
    keys = keys.filter(x => +x[1] === cols[toPosition[0]]);
    originCol = cols[toPosition[0]];
    toPosition = toPosition.substring(1);
  }

  const toRow = 8 - toPosition[1];
  const toCol = cols[toPosition[0]];

  const searchVal = JSON.stringify([toRow, toCol]);

  for (let i = 0; i < keys.length; i += 1) {
    const index = moves[keys[i]].map(x => JSON.stringify(x)).indexOf(searchVal);
    if (index >= 0) {

      if (piece[1] === 'P') {
        if (Math.abs(toRow - keys[i][0]) > 1) {
          if (color === 'W') {
            newState.canEnPassantB = `${toRow}${toCol}`;
          } else {
            newState.canEnPassantW = `${toRow}${toCol}`;
          }
        }
      }

      if (piece[1] === 'R') {
        if (color === 'W') {
          if (keys[i] === '70') {
            newState.hasMovedWQR = true;
          } else if (keys[i] === '77') {
            newState.hasMovedWKR = true;
          }
        } else if (keys[i] === '00') {
          newState.hasMovedBQR = true;
        } else if (keys[i] === '07') {
          newState.hasMovedBKR = true;
        }
      }

      return {
        move: [keys[i], [toRow, toCol].join('')],
        newState,
      };
    }
  }

  // handle en passant
  const direction = (color === 'W') ? 1 : -1;
  const from = `${toRow + direction}${originCol}`;
  const to = `${toRow}${toCol}`;
  const captured = `${toRow + direction}${toCol}`;

  return {
    move: { move: 'enpassant', from, to, captured, color },
    newState,
  };
};

const encodePGN = (gameString) => {

  console.log();
  console.log('============== GAME: PGN Notation ============');
  console.log(gameString);
  console.log();

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

  let pieceState = {
    hasMovedWK: false,
    hasMovedWKR: false,
    hasMovedWQR: false,
    hasMovedBK: false,
    hasMovedBKR: false,
    hasMovedBQR: false,
    canEnPassantW: '',
    canEnPassantB: '',
  };

  const gameArray = convertToArray(gameString);

  const last = gameArray[gameArray.length - 1];

  let winner = '';
  const movesList = [];
  let parent = encodeWithState(board, pieceState);

  const wins = {
    parent,
    board,
    white_win: 0,
    black_win: 0,
    draw: 0,
  };

  if (last === '1-0') {
    winner = 'W';
    gameArray.pop();
    wins.white_win = 1;
  } else if (last === '0-1') {
    winner = 'B';
    gameArray.pop();
    wins.black_win = 1;
  } else if (last === '1/2-1/2') {
    winner = 'draw';
    wins.draw = 1;
    gameArray.pop();
  } else if (last.indexOf('#') >= 0) {
    winner = (gameArray.length % 2 === 0) ? 'B' : 'W';
    if (winner === 'W') wins.white_win = 1;
    if (winner === 'B') wins.black_win = 1;
  }


  for (let i = 0; i < gameArray.length; i += 1) {
    const moveAndState = transcribeMove(gameArray[i], (i % 2 === 0) ? 'W' : 'B', board, pieceState);
    const move = moveAndState.move;
    pieceState = moveAndState.newState;
    board = mutateBoard(board, move);
    const encodedBoard = encodeWithState(board, pieceState);
    movesList.push(Object.assign({}, wins, {
      parent,
      board: encodedBoard,
    }));
    parent = encodedBoard;
  }

  return movesList;
};

/**
 *    TESTING
 */

const game = '1. e4 e5 2. Nf3 Nc6 3. Bb5 Nf6 4. O-O Bd6 5. Bc6 dc6 6. d4 Bg4 7. Qd3 Bf3 8. gf3 Nh5 9. Nc3 ed4 10. Ne2 Qh4 11. Ng3 O-O 12. Qd4 Rfd8 13. Qc3 Ng3 14. fg3 Bg3 15. hg3 Qg3 16. Kh1 Rd6 17. Qe1 Qh3 18. Kg1 Rg6 19. Kf2 Rg2 20. Ke3 f5 21. e5 Rc2 22. Bd2 Rd8 23. Bc3 f4 24. Kf4 Qh6 25. Ke4 Qg6 26. Kf4 Qh6 27. Ke4 Rh2 28. Rd1 Rh4 29. f4 Qg6 30. Ke3 Rh3 31. Rf3 Rf3 32. Kf3 Rd1 33. Qe2 Rd3 0-1';

const game2 = '1. d4 d5 2. Nf3 Nf6 3. e3 c6 4. c4 e6 5. Nc3 Nbd7 6. Bd3 Bd6 7. O-O O-O 8. e4 dxe4 9. Nxe4 Nxe4 10. Bxe4 Nf6 11. Bc2 h6 12. b3 b6 13. Bb2 Bb7 14. Qd3 g6 15. Rae1 Nh5 16. Bc1 Kg7 17. Rxe6 Nf6 18. Ne5 c5 19. Bxh6+ Kxh6 20. Nxf7+ 1-0';

const enPassant = '1. e4 Nf6 2. e5 Ne4 3. d3 Nc5 4. d4 Ne4 5. Qd3 d5 6. exd6 Nxd6 7. Nf3 b5 8. Bf4 e5 9. Bxe5 Bf5 10. Qb3 Nc6 11. Bxb5 Qd7 12. O-O Ne4 13. Nc3 a6 14. Ba4 Be6 15. d5 Bf5 16. Bxc6 Qxc6 17. dxc6 Bc5 18. Bxg7 Rg8 19. Ne5 Rxg7 20. Nxe4 Bxe4 21. g3 f5 22. Rad1 Bf3 23. Rd7 Rd8 24. Rxg7 Rd4 25. Qf7+ Kd8 26. Qg8+ Bf8 27. Qxf8#';

const game3 = '1.e4 e5 2.Nf3 d6 3.d4 Nd7 4.Bc4 c6 5.Ng5 Nh6 6.f4 Be7 7.O-O O-O 8.Nf3 exd4 9.Nxd4 d5 10.exd5 Nb6 11.Be2 Bc5 12.Kh1 Nxd5 13.Nc3 Re8 14.Nxd5 Qxd5 15. Nb3 Qxd1 16.Bxd1 Bb6 17.Bf3 Bf5 18.c3 Bd3 19.Rd1 Bc2 20.Rf1 Rad8 21.Nd2 Nf5 22.Nb3 Rd6 23.g3 Bd3 24.Bd2 Bxf1 25.Rxf1 g6 26.Kg2 Rd3 27.Kh3 a5 28.a4 h5 29.g4 hxg4+ 30.Kxg4 Re2 31.Kh3 Rexd2 32.Nxd2 Rxd2 0-1';

const startBoard = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];


const startPieceState = {
  hasMovedWK: false,
  hasMovedWKR: false,
  hasMovedWQR: false,
  hasMovedBK: false,
  hasMovedBKR: false,
  hasMovedBQR: false,
  canEnPassantW: '',
  canEnPassantB: '',
};


let board = startBoard;
let pieceState = startPieceState;

const games = [game, game2, enPassant, game3];

const showBoard = true;


const game4 = '1.e4 a5 0-1';

console.log(encodePGN(game4));

const saveToDB = (moveList) => {
  for (let i = 0; i < moveList.length; i += 1) {
    if (i % 2 === 0) {
      saveDeepRedWhite(moveList[i]);
    } else {
      saveDeepRedBlack(moveList[i]);
    }
  }
};

games.forEach(thisGame => saveToDB(encodePGN(thisGame)));
