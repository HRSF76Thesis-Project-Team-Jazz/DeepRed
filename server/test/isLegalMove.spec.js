const expect = require('chai').expect;
const isDiagPathClear = require('../chess/isLegalMove').isDiagPathClear;
const isLegalMoveBishop = require('../chess/isLegalMove').isLegalMoveBishop;

const emptyBoard = [
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
];
// original piece coordinate at (4, 4)
const boardWithClearPath = [
['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
[null, null, null, null, null, null, null, null],
[null, null, null, null, null, null, null, null],
[null, null, null, null, 'o1', null, null, null],
[null, null, null, null, null, null, null, null],
['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];
// destination piece 1 coordinate at (2, 2)
const boardWithUnclearPath = [
['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
[null, null, 'd1', null, null, null, null, null],
[null, null, null, null, null, 'd2', null, null],
[null, null, null, null, 'o1', null, null, null],
[null, null, null, 'd3', null, 'd4', null, null],
['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
];
const origin = [4, 4];
const destUpperLeft = [1, 1];
const destUpperRight = [1, 7];
const destLowerLeft = [6, 2];
const destLowerRight = [6, 6];
const destOffDiagonalPath = [3, 7];

describe('isDiagPathClear', () => {
  it('should return true when upper left direction path is clear', () => {
    expect(isDiagPathClear(boardWithClearPath, origin, destUpperLeft)).to.eql(true);
  });

  it('should return false when upper left direction path is not clear', () => {
    expect(isDiagPathClear(boardWithUnclearPath, origin, destUpperLeft)).to.eql(false);
  });

  it('should return true when upper right direction path is clear', () => {
    expect(isDiagPathClear(boardWithClearPath, origin, destUpperRight)).to.eql(true);
  });

  it('should return false when upper right direction path is not clear', () => {
    expect(isDiagPathClear(boardWithUnclearPath, origin, destUpperRight)).to.eql(false);
  });

  it('should return true when lower left direction path is clear', () => {
    expect(isDiagPathClear(boardWithClearPath, origin, destLowerLeft)).to.eql(true);
  });

  it('should return false when lower left direction path is not clear', () => {
    expect(isDiagPathClear(boardWithUnclearPath, origin, destLowerLeft)).to.eql(false);
  });

  it('should return true when lower right direction path is clear', () => {
    expect(isDiagPathClear(boardWithClearPath, origin, destLowerRight)).to.eql(true);
  });

  it('should return false when lower right direction path is not clear', () => {
    expect(isDiagPathClear(boardWithUnclearPath, origin, destLowerRight)).to.eql(false);
  });

  it('should be able to check diagonal clean path from upper left corner to bottom right corner', () => {
    expect(isDiagPathClear(emptyBoard, [0, 0], [7, 7])).to.eql(true);
  });

  it('should be able to check diagonal clean path from upper right corner to bottom left corner', () => {
    expect(isDiagPathClear(emptyBoard, [0, 7], [7, 0])).to.eql(true);
  });

  it('should be able to check diagonal clean path from bottom left corner to upper right corner', () => {
    expect(isDiagPathClear(emptyBoard, [7, 0], [0, 7])).to.eql(true);
  });

  it('should be able to check diagonal clean path from bottom right corner to upper left corner', () => {
    expect(isDiagPathClear(emptyBoard, [7, 7], [0, 0])).to.eql(true);
  });
});

describe('isLegalMoveBishop', () => {
  it('should return true when destination chess piece is in the diagonal clean path', () => {
    expect(isLegalMoveBishop(boardWithClearPath, origin, destUpperLeft)).to.eql(true);
  });

  it('should return false when destination chess piece is in the diagonal unclean path', () => {
    expect(isLegalMoveBishop(boardWithUnclearPath, origin, destUpperLeft)).to.eql(false);
  });

  it('should return false when destination chess piece is not in the diagonal unclean path', () => {
    expect(isLegalMoveBishop(boardWithUnclearPath, origin, destOffDiagonalPath)).to.eql(false);
  });

  it('should return false when destination chess piece is not in the diagonal clean path', () => {
    expect(isLegalMoveBishop(boardWithClearPath, origin, destOffDiagonalPath)).to.eql(false);
  });
});



