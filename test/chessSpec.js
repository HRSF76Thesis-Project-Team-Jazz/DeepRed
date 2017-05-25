const expect = require('chai').expect;

const ChessGame = require('../server/chess/ChessGame');
const isLegalMove = require('../server/chess/isLegalMove');

describe('ChessGame', () => {
  const testChessGame = new ChessGame();
  it('function (class) should exist', () => {
    expect(ChessGame).to.be.a('function');
  });
  const initBoard = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];
  it('should return object with board property', () => {
    expect(testChessGame.board).to.eql(initBoard);
  });
});

describe('isLegalMovePawn', () => {
  it('function should exist', () => {
    expect(isLegalMove).to.be.a('function');
  });
  const pawnTestBoard = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, 'BP', 'BP', 'BP'],
    [null, null, null, 'BP', null, null, null, 'WP'],
    [null, null, null, null, 'BP', null, 'WP', null],
    [null, null, null, null, null, 'WP', null, null],
    [null, 'BP', 'WP', null, null, null, null, null],
    ['WP', 'WP', null, 'WP', 'WP', null, null, null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];
  it('black pawn moves backward 1', () => {
    expect(isLegalMove(pawnTestBoard, [2, 3], [1, 3])).to.eql(false);
  });
  it('black pawn moves back diagonal left 1', () => {
    expect(isLegalMove(pawnTestBoard, [2, 3], [1, 2])).to.eql(false);
  });
  it('black pawn moves back diagonal right 1', () => {
    expect(isLegalMove(pawnTestBoard, [2, 3], [1, 4])).to.eql(false);
  });
  it('black pawn moves left 1', () => {
    expect(isLegalMove(pawnTestBoard, [2, 3], [2, 2])).to.eql(false);
  });
  it('black pawn moves right 1', () => {
    expect(isLegalMove(pawnTestBoard, [2, 3], [2, 4])).to.eql(false);
  });
  it('black pawn moves forward 1 (opening)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 1], [2, 1])).to.eql(true);
  });
  it('black pawn moves forward 2 (opening)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 1], [3, 1])).to.eql(true);
  });
  it('black pawn moves forward 3 (opening)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 1], [4, 1])).to.eql(false);
  });
  it('black pawn moves forward 1 (opening, blocked)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 7], [2, 7])).to.eql(false);
  });
  it('black pawn moves forward 2 (opening, blocked)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 6], [3, 6])).to.eql(false);
  });
  it('black pawn moves forward 1 (not opening)', () => {
    expect(isLegalMove(pawnTestBoard, [3, 4], [4, 4])).to.eql(true);
  });
  it('black pawn moves forward 2 (not opening)', () => {
    expect(isLegalMove(pawnTestBoard, [3, 4], [5, 4])).to.eql(false);
  });
  it('black pawn moves forward 3 (not opening)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 1], [4, 1])).to.eql(false);
  });
  it('black pawn moves diagonal 1 (no capture)', () => {
    expect(isLegalMove(pawnTestBoard, [1, 1], [2, 2])).to.eql(false);
  });
  it('black pawn moves diagonal 1 (self capture)', () => {
    expect(isLegalMove(pawnTestBoard, [2, 3], [3, 4])).to.eql(false);
  });
  it('black pawn test diagonal 1 (capture)', () => {
    expect(isLegalMove(pawnTestBoard, [3, 4], [4, 5])).to.eql(true);
  });
  it('white pawn moves backward 1', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [5, 5])).to.eql(false);
  });
  it('white pawn moves back diagonal left 1', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [5, 4])).to.eql(false);
  });
  it('white pawn moves back diagonal right 1', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [5, 6])).to.eql(false);
  });
  it('white pawn moves left 1', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [4, 4])).to.eql(false);
  });
  it('white pawn moves right 1', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [4, 6])).to.eql(false);
  });
  it('white pawn moves forward 1 (opening)', () => {
    expect(isLegalMove(pawnTestBoard, [6, 3], [5, 3])).to.eql(true);
  });
  it('white pawn moves forward 2 (opening)', () => {
    expect(isLegalMove(pawnTestBoard, [6, 3], [4, 3])).to.eql(true);
  });
  it('white pawn moves forward 3 (opening)', () => {
    expect(isLegalMove(pawnTestBoard, [6, 3], [3, 3])).to.eql(false);
  });
  it('white pawn moves forward 1 (opening, blocked)', () => {
    expect(isLegalMove(pawnTestBoard, [6, 1], [5, 1])).to.eql(false);
  });
  it('white pawn moves forward 2 (opening, blocked)', () => {
    expect(isLegalMove(pawnTestBoard, [6, 1], [4, 1])).to.eql(false);
  });
  it('white pawn moves forward 1 (not opening)', () => {
    expect(isLegalMove(pawnTestBoard, [5, 2], [4, 2])).to.eql(true);
  });
  it('white pawn moves forward 2 (not opening)', () => {
    expect(isLegalMove(pawnTestBoard, [5, 2], [3, 2])).to.eql(false);
  });
  it('white pawn moves forward 3 (not opening)', () => {
    expect(isLegalMove(pawnTestBoard, [5, 2], [2, 2])).to.eql(false);
  });
  it('white pawn moves left diagonal 1 (no capture)', () => {
    expect(isLegalMove(pawnTestBoard, [5, 2], [4, 1])).to.eql(false);
  });
  it('white pawn moves right diagonal 1 (no capture)', () => {
    expect(isLegalMove(pawnTestBoard, [5, 2], [4, 3])).to.eql(false);
  });
  it('white pawn moves left diagonal 1 (self capture)', () => {
    expect(isLegalMove(pawnTestBoard, [6, 3], [5, 2])).to.eql(false);
  });
  it('white pawn moves right diagonal 1 (self capture)', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [3, 6])).to.eql(false);
  });
  it('white pawn test diagonal 1 (capture)', () => {
    expect(isLegalMove(pawnTestBoard, [4, 5], [3, 4])).to.eql(true);
  });
});

describe('isLegalMoveRook', () => {
  const rookTestBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'BR', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedRookResultBoard = [
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [true, true, true, true, true, true, true, true],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
  ];
  const actualRookResultBoard = [];
  for (let i = 0; i < 8; i += 1) {
    actualRookResultBoard[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualRookResultBoard[i][j] = isLegalMove(rookTestBoard, [4, 4], [i, j]);
    }
  }
  it('rook moves as expected', () => {
    expect(actualRookResultBoard).to.eql(expectedRookResultBoard);
  });

  const rookTestBoard2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'BP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', null, null, null, 'BR', null, 'BP', null],
    [null, null, null, null, 'BP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedRookResultBoard2 = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [true, true, true, true, true, true, true, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ];
  const actualRookResultBoard2 = [];
  for (let i = 0; i < 8; i += 1) {
    actualRookResultBoard2[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualRookResultBoard2[i][j] = isLegalMove(rookTestBoard2, [4, 4], [i, j]);
    }
  }
  it('rook blocked as expected', () => {
    expect(actualRookResultBoard2).to.eql(expectedRookResultBoard2);
  });
});

describe('isLegalMoveKnight', () => {
  const knightTestBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'WN', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedKnightResultBoard = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, true, false, true, false, false],
    [false, false, true, false, false, false, true, false],
    [false, false, false, false, false, false, false, false],
    [false, false, true, false, false, false, true, false],
    [false, false, false, true, false, true, false, false],
    [false, false, false, false, false, false, false, false],
  ];
  const actualKnightResultBoard = [];
  for (let i = 0; i < 8; i += 1) {
    actualKnightResultBoard[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualKnightResultBoard[i][j] = isLegalMove(knightTestBoard, [4, 4], [i, j]);
    }
  }
  it('knight moves as expected', () => {
    expect(actualKnightResultBoard).to.eql(expectedKnightResultBoard);
  });

  const knightTestBoard2 = [
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'WN', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  ];
  const actualKnightResultBoard2 = [];
  for (let i = 0; i < 8; i += 1) {
    actualKnightResultBoard2[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualKnightResultBoard2[i][j] = isLegalMove(knightTestBoard2, [4, 4], [i, j]);
    }
  }
  it('knight cannot be blocked', () => {
    expect(actualKnightResultBoard2).to.eql(expectedKnightResultBoard);
  });
});

describe('isLegalMoveKing', () => {
  const kingTestBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'WK', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedKingResultBoard = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, true, true, true, false, false],
    [false, false, false, true, false, true, false, false],
    [false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ];
  const actualKingResultBoard = [];
  for (let i = 0; i < 8; i += 1) {
    actualKingResultBoard[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualKingResultBoard[i][j] = isLegalMove(kingTestBoard, [4, 4], [i, j]);
    }
  }
  it('king moves as expected', () => {
    expect(actualKingResultBoard).to.eql(expectedKingResultBoard);
  });

  const kingTestBoard2 = [
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'WK', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  ];
  const actualKingResultBoard2 = [];
  for (let i = 0; i < 8; i += 1) {
    actualKingResultBoard2[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualKingResultBoard2[i][j] = isLegalMove(kingTestBoard2, [4, 4], [i, j]);
    }
  }
  it('king cannot be blocked', () => {
    expect(actualKingResultBoard2).to.eql(expectedKingResultBoard);
  });
});