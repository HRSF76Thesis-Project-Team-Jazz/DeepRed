const expect = require('chai').expect;

const ChessGame = require('../server/chess/ChessGame');
const isLegalMove = require('../server/chess/isLegalMove');

describe('ChessGame', function() {
  let testChessGame = new ChessGame();
  it('ChessGame class should exist', function() {
    expect(ChessGame).to.be.a('function');
  });
  let initBoard = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];
  it('should return obj with board property', function() {
    expect(testChessGame.board).to.eql(initBoard);
  });
});

describe('isLegalMove', function() {
  it('isLegalMovePawn function should exist', function() {
    expect(isLegalMove).to.be.a('function');
  });
  let pawnTestBoard = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, null, 'BP', 'BP', 'BP'],
    [null, null, null, 'BP', null, null, null, 'WP'],
    [null, null, null, null, 'BP', null, 'WP', null],
    [null, null, null, null, null, 'WP', null, null],
    [null, null, 'WP', null, null, null, null, null],
    ['WP', 'WP', null, 'WP', 'WP', null, null, null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];
  it('black pawn move forward 1 (opening)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [2, 1])).to.eql(true);
  });
  it('black pawn move forward 2 (opening)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [3, 1])).to.eql(true);
  });
  it('black pawn move forward 3 (opening)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [4, 1])).to.eql(false);
  });
  it('black pawn move forward 1 (opening, blocked)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 7], [2, 7])).to.eql(false);
  });
  it('black pawn move forward 2 (opening, blocked)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 6], [3, 6])).to.eql(false);
  });
  it('black pawn move forward 1 (not opening)', function() {
    expect(isLegalMove(pawnTestBoard, [3, 4], [4, 4])).to.eql(true);
  });
  it('black pawn move forward 2 (not opening)', function() {
    expect(isLegalMove(pawnTestBoard, [3, 4], [5, 4])).to.eql(false);
  });
  it('black pawn move forward 3 (not opening)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [4, 1])).to.eql(false);
  });
  it('black pawn move diagonal 1 (no capture)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [2, 2])).to.eql(false);
  });
  it('black pawn move diagonal 1 (self capture)', function() {
    expect(isLegalMove(pawnTestBoard, [2, 3], [3, 4])).to.eql(false);
  });
  it('black pawn test diagonal 1 (capture)', function() {
    expect(isLegalMove(pawnTestBoard, [3, 4], [4, 5])).to.eql(true);
  });
  it('white pawn move forward 1 (opening)', function() {
    expect(isLegalMove(pawnTestBoard, [6, 3], [5, 3])).to.eql(true);
  });
  it('white pawn move forward 2 (opening)', function() {
    expect(isLegalMove(pawnTestBoard, [6, 3], [4, 3])).to.eql(true);
  });
  it('white pawn move forward 3 (opening)', function() {
    expect(isLegalMove(pawnTestBoard, [6, 3], [3, 3])).to.eql(false);
  });
  it('white pawn move forward 1 (opening, blocked)', function() {
    expect(isLegalMove(pawnTestBoard, [6, 2], [5, 2])).to.eql(false);
  });
  it('white pawn move forward 2 (opening, blocked)', function() {
    expect(isLegalMove(pawnTestBoard, [6, 2], [4, 2])).to.eql(false);
  });
  it('white pawn move forward 1 (not opening)', function() {
    expect(isLegalMove(pawnTestBoard, [3, 4], [4, 4])).to.eql(true);
  });
  it('white pawn move forward 2 (not opening)', function() {
    expect(isLegalMove(pawnTestBoard, [3, 4], [5, 4])).to.eql(false);
  });
  it('white pawn move forward 3 (not opening)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [4, 1])).to.eql(false);
  });
  it('white pawn move diagonal 1 (no capture)', function() {
    expect(isLegalMove(pawnTestBoard, [1, 1], [2, 2])).to.eql(false);
  });
  it('white pawn move diagonal 1 (self capture)', function() {
    expect(isLegalMove(pawnTestBoard, [2, 3], [3, 4])).to.eql(false);
  });
  it('white pawn test diagonal 1 (capture)', function() {
    expect(isLegalMove(pawnTestBoard, [3, 4], [4, 5])).to.eql(true);
  });

});
