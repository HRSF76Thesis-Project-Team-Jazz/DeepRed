const expect = require('chai').expect;

const ChessGame = require('../chess/ChessGame');
const isLegalMove = require('../chess/isLegalMove');

const testChessGame = new ChessGame();

describe('ChessGame', () => {
  it('function (class) should exist', () => {
    expect(ChessGame).to.be.a('function');
  });
  const initBoard = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should return object with board, blackCapPieces, whiteCapPieces, turn, history properties', () => {
    expect(testChessGame.board).to.be.a('array');
    expect(testChessGame.blackCapPieces).to.be.a('array');
    expect(testChessGame.whiteCapPieces).to.be.a('array');
    expect(testChessGame.turn).to.be.a('string');
    // expect(testChessGame.history).to.be.a('object');
  });
  it('should return object with starting board state', () => {
    expect(testChessGame.board).to.eql(initBoard);
  });
  it('should return object with movePiece method', () => {
    expect(testChessGame.movePiece).to.be.a('function');
  });
  it('should return object with capturePiece method', () => {
    expect(testChessGame.addToCaptureArray).to.be.a('function');
  });
});

describe('ChessGame.movePiece', () => {
  it('should return obj with error if destination is undefined', () => {
    expect(err => testChessGame.movePiece([0, 0], undefined)).to.eql('Attempted destination is invalid.');
  });
  it('should return obj with error if origin is undefined', () => {
    expect(testChessGame.movePiece(undefined, [4, 4]).error).to.eql('Origin is invalid.');
  });
  it('should return obj with error if origin is undefined', () => {
    expect(testChessGame.movePiece([500, 500], [4, 4]).error).to.eql('Origin is invalid.');
  });
  it('should return obj with error if origin equals destination', () => {
    expect(testChessGame.movePiece([0, 0], [0, 0]).error).to.eql('Origin and destination cannot be the same.');
  });
  it('should return obj with error if capturing own piece', () => {
    expect(testChessGame.movePiece([7, 0], [6, 0]).error).to.eql('Cannot capture your own piece.');
  });
  const expectedMoveBoard = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should allow move a2 to a3', () => {
    expect(testChessGame.movePiece([6, 0], [4, 0]).game.board).to.be.eql(expectedMoveBoard);
  });

  it('should not allow out of order move', () => {
    expect(testChessGame.movePiece([7, 7], [7, 6]).error).to.eql('Not your turn.');
  });
});

describe('ChessGame.capturePiece', () => {
  const captChessGame = new ChessGame();
  captChessGame.board = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BQ', 'BP', 'BP', 'BP'],
    [null, null, null, null, 'BP', null, null, null],
    [null, null, null, 'BP', null, null, 'WN', null],
    ['WP', 'BB', null, null, 'WP', null, null, 'WP'],
    [null, null, null, null, null, 'WP', null, null],
    [null, 'WP', 'WP', 'WP', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  const expectedMovePawnCapBoard1 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BQ', 'BP', 'BP', 'BP'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, 'BP', null, null, 'WN', null],
    [null, 'BB', null, null, 'WP', null, null, 'WP'],
    [null, null, null, null, null, 'WP', null, null],
    [null, 'WP', 'WP', 'WP', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow WP to move forward', () => {
    expect(captChessGame.movePiece([4, 0], [3, 0]).game.board).to.eql(expectedMovePawnCapBoard1);
  });
  it('whiteCapPieces array is still empty', () => {
    expect(captChessGame.blackCapPieces).to.eql([]);
  });
  const expectedPawnCapBoard1 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BQ', 'BP', 'BP', 'BP'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, 'WN', null],
    [null, 'BB', null, null, 'BP', null, null, 'WP'],
    [null, null, null, null, null, 'WP', null, null],
    [null, 'WP', 'WP', 'WP', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow BP to capture WP', () => {
    expect(captChessGame.movePiece([3, 3], [4, 4]).game.board).to.eql(expectedPawnCapBoard1);
  });
  it('should add WP to blackCapPieces array', () => {
    expect(captChessGame.blackCapPieces).to.eql(['WP']);
  });
  const expectedPawnCapBoard2 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BQ', 'BP', 'BP', 'BP'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, 'WN', null],
    [null, 'BB', null, null, 'WP', null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'WP', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow WP to capture BP', () => {
    expect(captChessGame.movePiece([5, 5], [4, 4]).game.board).to.eql(expectedPawnCapBoard2);
  });
  it('should add BP to whiteCapPieces array', () => {
    expect(captChessGame.whiteCapPieces).to.eql(['BP']);
  });
  const expectedBishopCapBoard = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BQ', 'BP', 'BP', 'BP'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, 'WN', null],
    [null, null, null, null, 'WP', null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'BB', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow BB to capture WP', () => {
    expect(captChessGame.movePiece([4, 1], [6, 3]).game.board).to.eql(expectedBishopCapBoard);
  });
  it('should add WP to blackCapPieces array', () => {
    expect(captChessGame.blackCapPieces).to.eql(['WP', 'WP']);
  });
  const expectedKnightCapBoard1 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BQ', 'BP', 'BP', 'WN'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, 'WP', null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'BB', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow WK to capture BP', () => {
    expect(captChessGame.movePiece([3, 6], [1, 7]).game.board).to.eql(expectedKnightCapBoard1);
  });
  it('should add WP to whiteCapPieces array', () => {
    expect(captChessGame.whiteCapPieces).to.eql(['BP', 'BP']);
  });
  const expectedQueenCapBoard1 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, 'BP', 'BP', 'WN'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, 'WP', null, null, 'BQ'],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'BB', null, null, 'WP', null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow BQ to capture WP', () => {
    expect(captChessGame.movePiece([1, 4], [4, 7]).game.board).to.eql(expectedQueenCapBoard1);
  });
  it('should add WP to whiteCapPieces array', () => {
    expect(captChessGame.blackCapPieces).to.eql(['WP', 'WP', 'WP']);
  });
  const expectedKingCapBoard1 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, 'BP', 'BP', 'WN'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, 'WP', null, null, 'BQ'],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'WK', null, null, 'WP', null],
    ['WR', 'WN', 'WB', null, 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow WK to capture BB', () => {
    expect(captChessGame.movePiece([7, 3], [6, 3]).game.board).to.eql(expectedKingCapBoard1);
  });
  it('should add BB to whiteCapPieces array', () => {
    expect(captChessGame.whiteCapPieces).to.eql(['BP', 'BP', 'BB']);
  });
  const expectedRookCapBoard1 = [
    ['BR', 'BN', 'BB', 'BK', null, null, 'BN', null],
    ['BP', 'BP', 'BP', null, null, 'BP', 'BP', 'BR'],
    [null, null, null, null, 'BP', null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, 'WP', null, null, 'BQ'],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', 'WP', 'WK', null, null, 'WP', null],
    ['WR', 'WN', 'WB', null, 'WQ', 'WB', null, 'WR'],
  ];
  it('should allow BR to capture WN', () => {
    expect(captChessGame.movePiece([0, 7], [1, 7]).game.board).to.eql(expectedRookCapBoard1);
  });
  it('should add WN to blackCapPieces array', () => {
    expect(captChessGame.blackCapPieces).to.eql(['WP', 'WP', 'WP', 'WN']);
  });
});

describe('isLegalMovePawn', () => {
  it('function should exist', () => {
    expect(isLegalMove).to.be.a('function');
  });
  const pawnGame = new ChessGame();
  pawnGame.board = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, 'BP', 'BP', 'BP'],
    [null, null, null, 'BP', null, null, null, 'WP'],
    [null, null, null, null, 'BP', null, 'WP', null],
    [null, null, null, null, null, 'WP', null, null],
    [null, 'BP', 'WP', null, null, null, null, null],
    ['WP', 'WP', null, 'WP', 'WP', null, null, null],
    ['WR', 'WN', 'WB', 'BK', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('black pawn moves backward 1', () => {
    expect(isLegalMove(pawnGame, [2, 3], [1, 3]).bool).to.eql(false);
  });
  it('black pawn moves back diagonal left 1', () => {
    expect(isLegalMove(pawnGame, [2, 3], [1, 2]).bool).to.eql(false);
  });
  it('black pawn moves back diagonal right 1', () => {
    expect(isLegalMove(pawnGame, [2, 3], [1, 4]).bool).to.eql(false);
  });
  it('black pawn moves left 1', () => {
    expect(isLegalMove(pawnGame, [2, 3], [2, 2]).bool).to.eql(false);
  });
  it('black pawn moves right 1', () => {
    expect(isLegalMove(pawnGame, [2, 3], [2, 4]).bool).to.eql(false);
  });
  it('black pawn moves forward 1 (opening)', () => {
    expect(isLegalMove(pawnGame, [1, 1], [2, 1]).bool).to.eql(true);
  });
  it('black pawn moves forward 2 (opening)', () => {
    expect(isLegalMove(pawnGame, [1, 1], [3, 1]).bool).to.eql(true);
  });
  it('black pawn moves forward 3 (opening)', () => {
    expect(isLegalMove(pawnGame, [1, 1], [4, 1]).bool).to.eql(false);
  });
  it('black pawn moves forward 1 (opening, blocked)', () => {
    expect(isLegalMove(pawnGame, [1, 7], [2, 7]).bool).to.eql(false);
  });
  it('black pawn moves forward 2 (opening, blocked)', () => {
    expect(isLegalMove(pawnGame, [1, 6], [3, 6]).bool).to.eql(false);
  });
  it('black pawn moves forward 1 (not opening)', () => {
    expect(isLegalMove(pawnGame, [3, 4], [4, 4]).bool).to.eql(true);
  });
  it('black pawn moves forward 2 (not opening)', () => {
    expect(isLegalMove(pawnGame, [3, 4], [5, 4]).bool).to.eql(false);
  });
  it('black pawn moves forward 3 (not opening)', () => {
    expect(isLegalMove(pawnGame, [1, 1], [4, 1]).bool).to.eql(false);
  });
  it('black pawn moves diagonal 1 (no capture)', () => {
    expect(isLegalMove(pawnGame, [1, 1], [2, 2]).bool).to.eql(false);
  });
  it('black pawn moves diagonal 1 (self capture)', () => {
    expect(isLegalMove(pawnGame, [2, 3], [3, 4]).bool).to.eql(false);
  });
  it('black pawn test diagonal 1 (capture)', () => {
    expect(isLegalMove(pawnGame, [3, 4], [4, 5]).bool).to.eql(true);
  });
  it('white pawn moves backward 1', () => {
    expect(isLegalMove(pawnGame, [4, 5], [5, 5]).bool).to.eql(false);
  });
  it('white pawn moves back diagonal left 1', () => {
    expect(isLegalMove(pawnGame, [4, 5], [5, 4]).bool).to.eql(false);
  });
  it('white pawn moves back diagonal right 1', () => {
    expect(isLegalMove(pawnGame, [4, 5], [5, 6]).bool).to.eql(false);
  });
  it('white pawn moves left 1', () => {
    expect(isLegalMove(pawnGame, [4, 5], [4, 4]).bool).to.eql(false);
  });
  it('white pawn moves right 1', () => {
    expect(isLegalMove(pawnGame, [4, 5], [4, 6]).bool).to.eql(false);
  });
  it('white pawn moves forward 1 (opening)', () => {
    expect(isLegalMove(pawnGame, [6, 3], [5, 3]).bool).to.eql(true);
  });
  it('white pawn moves forward 2 (opening)', () => {
    expect(isLegalMove(pawnGame, [6, 3], [4, 3]).bool).to.eql(true);
  });
  it('white pawn moves forward 3 (opening)', () => {
    expect(isLegalMove(pawnGame, [6, 3], [3, 3]).bool).to.eql(false);
  });
  it('white pawn moves forward 1 (opening, blocked)', () => {
    expect(isLegalMove(pawnGame, [6, 1], [5, 1]).bool).to.eql(false);
  });
  it('white pawn moves forward 2 (opening, blocked)', () => {
    expect(isLegalMove(pawnGame, [6, 1], [4, 1]).bool).to.eql(false);
  });
  it('white pawn moves forward 1 (not opening)', () => {
    expect(isLegalMove(pawnGame, [5, 2], [4, 2]).bool).to.eql(true);
  });
  it('white pawn moves forward 2 (not opening)', () => {
    expect(isLegalMove(pawnGame, [5, 2], [3, 2]).bool).to.eql(false);
  });
  it('white pawn moves forward 3 (not opening)', () => {
    expect(isLegalMove(pawnGame, [5, 2], [2, 2]).bool).to.eql(false);
  });
  it('white pawn moves left diagonal 1 (no capture)', () => {
    expect(isLegalMove(pawnGame, [5, 2], [4, 1]).bool).to.eql(false);
  });
  it('white pawn moves right diagonal 1 (no capture)', () => {
    expect(isLegalMove(pawnGame, [5, 2], [4, 3]).bool).to.eql(false);
  });
  it('white pawn moves left diagonal 1 (self capture)', () => {
    expect(isLegalMove(pawnGame, [6, 3], [5, 2]).bool).to.eql(false);
  });
  it('white pawn moves right diagonal 1 (self capture)', () => {
    expect(isLegalMove(pawnGame, [4, 5], [3, 6]).bool).to.eql(false);
  });
  it('white pawn test diagonal 1 (capture)', () => {
    expect(isLegalMove(pawnGame, [4, 5], [3, 4]).bool).to.eql(true);
  });
});
//
describe('En Passant', () => {
  const enPassantGame = new ChessGame();
  it('should return object with empty canEnPassant', () => {
    expect(enPassantGame.canEnPassant).to.eql([]);
  });
  const enPassantGameBoard = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WP', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should move pawn', () => {
    expect(enPassantGame.movePiece([6, 3], [4, 3]).game.board).to.be.eql(enPassantGameBoard);
  });
  it('should return object with dest canEnPassant', () => {
    expect(enPassantGame.canEnPassant).to.eql([4, 3]);
  });
  const enPassantGameBoard2 = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', null, 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, 'BP', null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WP', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should move pawn', () => {
    expect(enPassantGame.movePiece([1, 2], [2, 2]).game.board).to.be.eql(enPassantGameBoard2);
  });
  it('should return object with empty canEnPassant', () => {
    expect(enPassantGame.canEnPassant).to.eql([]);
  });
  const enPassantGameBoard3 = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', null, 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, 'BP', null, null, null, null, null],
    [null, null, null, 'WP', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should move pawn', () => {
    expect(enPassantGame.movePiece([4, 3], [3, 3]).game.board).to.be.eql(enPassantGameBoard3);
  });
  it('should return object with empty canEnPassant', () => {
    expect(enPassantGame.canEnPassant).to.eql([]);
  });
  const enPassantGameBoard4 = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', null, 'BP', null, 'BP', 'BP', 'BP'],
    [null, null, 'BP', null, null, null, null, null],
    [null, null, null, 'WP', 'BP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should move pawn', () => {
    expect(enPassantGame.movePiece([1, 4], [3, 4]).game.board).to.be.eql(enPassantGameBoard4);
  });
  it('should return object with empty canEnPassant', () => {
    expect(enPassantGame.canEnPassant).to.eql([3, 4]);
  });
  const enPassantGameBoard5 = [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', null, 'BP', null, 'BP', 'BP', 'BP'],
    [null, null, 'BP', null, 'WP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should capture pawn via en passant', () => {
    expect(enPassantGame.movePiece([3, 3], [2, 4]).game.board).to.be.eql(enPassantGameBoard5);
  });
  it('should return object with empty canEnPassant', () => {
    expect(enPassantGame.canEnPassant).to.eql([]);
  });
});

describe('isLegalMoveRook', () => {
  const rookGame = new ChessGame();
  rookGame.board = [
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
    [true, true, true, true, false, true, true, true],
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
      actualRookResultBoard[i][j] = isLegalMove(rookGame, [4, 4], [i, j]).bool;
    }
  }
  it('rook moves as expected', () => {
    expect(actualRookResultBoard).to.eql(expectedRookResultBoard);
  });
  const rookGame2 = new ChessGame();
  rookGame2.board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'WP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', null, null, null, 'BR', null, 'WP', null],
    [null, null, null, null, 'WP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedRookResultBoard2 = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [false, false, false, false, true, false, false, false],
    [true, true, true, true, false, true, true, false],
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
      actualRookResultBoard2[i][j] = isLegalMove(rookGame2, [4, 4], [i, j]).bool;
    }
  }
  it('rook blocked as expected', () => {
    expect(actualRookResultBoard2).to.eql(expectedRookResultBoard2);
  });
});

describe('isLegalMoveKnight', () => {
  const knightGame = new ChessGame();
  knightGame.board = [
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
      actualKnightResultBoard[i][j] = isLegalMove(knightGame, [4, 4], [i, j]).bool;
    }
  }
  it('knight moves as expected', () => {
    expect(actualKnightResultBoard).to.eql(expectedKnightResultBoard);
  });
  const knightGame2 = new ChessGame();
  knightGame2.board = [
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
      actualKnightResultBoard2[i][j] = isLegalMove(knightGame2, [4, 4], [i, j]).bool;
    }
  }
  it('knight cannot be blocked', () => {
    expect(actualKnightResultBoard2).to.eql(expectedKnightResultBoard);
  });
});

describe('isLegalMoveBishop', () => {
  const bishopGame = new ChessGame();
  bishopGame.board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'WB', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedBishopResultBoard = [
    [true, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, true],
    [false, false, true, false, false, false, true, false],
    [false, false, false, true, false, true, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, true, false, true, false, false],
    [false, false, true, false, false, false, true, false],
    [false, true, false, false, false, false, false, true],
  ];
  const actualBishopResultBoard = [];
  for (let i = 0; i < 8; i += 1) {
    actualBishopResultBoard[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualBishopResultBoard[i][j] = isLegalMove(bishopGame, [4, 4], [i, j]).bool;
    }
  }
  it('bishop moves as expected', () => {
    expect(actualBishopResultBoard).to.eql(expectedBishopResultBoard);
  });
  const bishopGame2 = new ChessGame();
  bishopGame2.board = [
    ['BP', null, null, null, null, null, null, null],
    [null, 'BP', null, null, null, null, null, null],
    [null, null, null, null, 'BP', null, 'BP', null],
    [null, null, null, null, null, null, null, null],
    [null, 'BP', null, 'BP', 'WB', null, null, 'BP'],
    [null, null, null, null, null, 'BP', null, null],
    [null, null, null, null, 'BP', null, null, null],
    [null, 'BP', null, null, null, null, null, null],
  ];
  const expectedBishopResultBoard2 = [
    [false, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, false, false, true, false],
    [false, false, false, true, false, true, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, true, false, true, false, false],
    [false, false, true, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
  ];
  const actualBishopResultBoard2 = [];
  for (let i = 0; i < 8; i += 1) {
    actualBishopResultBoard2[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualBishopResultBoard2[i][j] = isLegalMove(bishopGame2, [4, 4], [i, j]).bool;
    }
  }
  it('bishop blocked as expected', () => {
    expect(actualBishopResultBoard2).to.eql(expectedBishopResultBoard2);
  });
});

describe('isLegalMoveQueen', () => {
  const queenGame = new ChessGame();
  queenGame.board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'WQ', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  const expectedQueenResultBoard = [
    [true, false, false, false, true, false, false, false],
    [false, true, false, false, true, false, false, true],
    [false, false, true, false, true, false, true, false],
    [false, false, false, true, true, true, false, false],
    [true, true, true, true, false, true, true, true],
    [false, false, false, true, true, true, false, false],
    [false, false, true, false, true, false, true, false],
    [false, true, false, false, true, false, false, true],
  ];
  const actualQueenResultBoard = [];
  for (let i = 0; i < 8; i += 1) {
    actualQueenResultBoard[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualQueenResultBoard[i][j] = isLegalMove(queenGame, [4, 4], [i, j]).bool;
    }
  }
  it('queen moves as expected', () => {
    expect(actualQueenResultBoard).to.eql(expectedQueenResultBoard);
  });
  const queenGame2 = new ChessGame();
  queenGame2.board = [
    ['BP', null, null, null, null, null, null, null],
    [null, 'BP', null, null, null, null, null, null],
    [null, null, null, null, 'BP', null, 'BP', null],
    [null, null, null, null, null, null, null, null],
    [null, 'BP', null, 'BP', 'WQ', null, null, 'BP'],
    [null, null, null, null, null, 'BP', null, null],
    [null, null, null, null, 'BP', null, null, null],
    [null, 'BP', null, null, null, null, null, null],
  ];
  const expectedQueenResultBoard2 = [
    [false, false, false, false, false, false, false, false],
    [false, true, false, false, false, false, false, false],
    [false, false, true, false, true, false, true, false],
    [false, false, false, true, true, true, false, false],
    [false, false, false, true, false, true, true, true],
    [false, false, false, true, true, true, false, false],
    [false, false, true, false, true, false, false, false],
    [false, true, false, false, false, false, false, false],
  ];
  const actualQueenResultBoard2 = [];
  for (let i = 0; i < 8; i += 1) {
    actualQueenResultBoard2[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualQueenResultBoard2[i][j] = isLegalMove(queenGame2, [4, 4], [i, j]).bool;
    }
  }
  it('queen blocked as expected', () => {
    expect(actualQueenResultBoard2).to.eql(expectedQueenResultBoard2);
  });
});

describe('isLegalMoveKing', () => {
  const kingGame = new ChessGame();
  kingGame.hasMovedWK = true;
  kingGame.board = [
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
      actualKingResultBoard[i][j] = isLegalMove(kingGame, [4, 4], [i, j]).bool;
    }
  }
  it('king moves as expected', () => {
    expect(actualKingResultBoard).to.eql(expectedKingResultBoard);
  });
  const kingGame2 = new ChessGame();
  kingGame2.board = [
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
      actualKingResultBoard2[i][j] = isLegalMove(kingGame2, [4, 4], [i, j]).bool;
    }
  }
  it('king cannot be blocked', () => {
    expect(actualKingResultBoard2).to.eql(expectedKingResultBoard);
  });
  const kingCastleGame = new ChessGame();
  kingCastleGame.board = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];
  const expectedWKingCastleResultBoard = [
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, true, true, true, false, false],
    [false, false, true, true, false, true, true, false],
  ];
  const actualKingCastleResultBoard = [];
  for (let i = 0; i < 8; i += 1) {
    actualKingCastleResultBoard[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualKingCastleResultBoard[i][j] = isLegalMove(kingCastleGame, [7, 4], [i, j]).bool;
    }
  }
  it('white king can castle expected', () => {
    expect(actualKingCastleResultBoard).to.eql(expectedWKingCastleResultBoard);
  });
  const kingCastleGame2 = new ChessGame();
  kingCastleGame2.board = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];
  const actualKingCastleResultBoard2 = [];
  for (let i = 0; i < 8; i += 1) {
    actualKingCastleResultBoard2[i] = new Array(8);
  }
  for (let i = 0; i < 8; i += 1) {
    for (let j = 0; j < 8; j += 1) {
      actualKingCastleResultBoard2[i][j] = isLegalMove(kingCastleGame2, [0, 4], [i, j]).bool;
    }
  }
  const expectedBKingCastleResultBoard = [
    [false, false, true, true, false, true, true, false],
    [false, false, false, true, true, true, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
    [false, false, false, false, false, false, false, false],
  ];
  it('black king can castle expected', () => {
    expect(actualKingCastleResultBoard2).to.eql(expectedBKingCastleResultBoard);
  });
});

describe('Check', () => {
  const noCheckChessGame = new ChessGame();
  it('nobody should be in check', () => {
    expect(noCheckChessGame.playerInCheck).to.eql(null);
  });
  const checkWChessGame = new ChessGame();
  checkWChessGame.board = [
    ['BR', null, 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', null, null, 'BP', 'BP'],
    [null, null, 'BN', null, null, null, null, null],
    [null, null, null, null, 'BP', null, null, null],
    [null, null, null, null, 'WP', null, null, null],
    [null, null, null, null, null, 'WQ', null, null],
    ['WP', 'WP', 'WP', 'WP', null, 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
  ];
  it('should put black in check', () => {
    expect(checkWChessGame.movePiece([5, 5], [1, 5]).game.playerInCheck).to.eql('B');
  });
  it('should error if still in check after moving', () => {
    expect(checkWChessGame.movePiece([1, 0], [2, 0]).error).to.eql('Cannot leave yourself in check.');
  });
  it('should not allow move if still in check', () => {
    expect(checkWChessGame.movePiece([1, 0], [2, 0]).game.board).to.eql(checkWChessGame.board);
  });
  it('should allow move if getting out of check', () => {
    expect(checkWChessGame.movePiece([0, 4], [1, 5]).error).to.eql(null);
  });
  const expectedCheckWChessBoard = [
    ['BR', null, 'BB', 'BQ', null, 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', null, 'BK', 'BP', 'BP'],
    [null, null, 'BN', null, null, null, null, null],
    [null, null, null, null, 'BP', null, null, null],
    [null, null, null, null, 'WP', null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', null, 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', null, 'WK', 'WB', 'WN', 'WR'],
  ];
  it('board state should be as expected', () => {
    // console.log(checkWChessGame.board);
    expect(checkWChessGame.board).to.eql(expectedCheckWChessBoard);
  });
});

describe('White Checkmate', () => {
  const checkmateWChessGame = new ChessGame();
  checkmateWChessGame.board = [
    ['BR', null, 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, null, 'BP', 'BP'],
    [null, null, 'BN', 'BP', null, null, null, null],
    [null, null, null, null, 'BP', null, null, null],
    [null, null, 'WB', null, 'WP', null, null, null],
    [null, null, null, null, null, 'WQ', null, null],
    ['WP', 'WP', 'WP', 'WP', null, 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', null, 'WK', null, 'WN', 'WR'],
  ];
  it('should allow move to checkmate', () => {
    expect(checkmateWChessGame.movePiece([5, 5], [1, 5]).error).to.eql(null);
  });
  it('should declare winner if checkmate', () => {
    expect(checkmateWChessGame.winner).to.eql('W');
  });
});

describe('Black Checkmate', () => {
  const checkmateBChessGame = new ChessGame();
  checkmateBChessGame.board = [
    ['BR', null, 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, null, 'BP', 'BP'],
    [null, null, 'BN', 'BP', null, null, null, null],
    [null, null, null, null, 'BR', null, null, null],
    [null, null, null, null, null, 'BQ', null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', null, null, null, null],
    ['WR', 'WN', 'WB', 'WK', null, null, null, null],
  ];
  checkmateBChessGame.turn = 'B';
  it('should allow move to checkmate', () => {
    expect(checkmateBChessGame.movePiece([4, 5], [5, 5]).error).to.eql(null);
  });
  it('should declare winner if checkmate', () => {
    expect(checkmateBChessGame.winner).to.eql('B');
  });
});

describe('White Stalemate', () => {
  const stalemateChessGame = new ChessGame();
  stalemateChessGame.board = [
    [null, 'BK', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'WK', null, null, null, null, null, null],
    ['WQ', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  it('should allow move to stalemate', () => {
    expect(stalemateChessGame.movePiece([3, 0], [2, 0]).error).to.eql(null);
  });
  it('should declare Draw if stalemate', () => {
    // console.log(stalemateChessGame.board);
    expect(stalemateChessGame.winner).to.eql('D');
  });
});

describe('Black Stalemate', () => {
  const stalemateChessGame = new ChessGame();
  stalemateChessGame.board = [
    [null, 'WK', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'BK', null, null, null, null, null, null],
    ['BQ', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];
  stalemateChessGame.turn = 'B';
  it('should allow move to stalemate', () => {
    expect(stalemateChessGame.movePiece([3, 0], [2, 0]).error).to.eql(null);
  });
  it('should declare Draw if stalemate', () => {
    // console.log(stalemateChessGame.board);
    expect(stalemateChessGame.winner).to.eql('D');
  });
});
