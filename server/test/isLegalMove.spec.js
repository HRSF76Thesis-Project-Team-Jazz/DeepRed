const expect = require('chai').expect;
const isDiagPathClear = require('../chess/isLegalMove');

describe('isDiagPathClear', function() {
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
  const dest = [2, 2];

  it('should return true when upper left direction path is clear', function() {
    const result = isDiagPathClear(boardWithClearPath, origin, dest);
    expect(result).to.eql(true);
  });

});
