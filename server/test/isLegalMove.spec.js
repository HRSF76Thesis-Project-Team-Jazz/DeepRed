// const expect = require('chai').expect;
// const Profile = require('../../db/models/profiles.js');
// const dbUtils = require('../../db/lib/utils.js');
// const isLegalMove = require('../chess/isLegalMove');


//   describe('isDiagPathClear', function() {
//     beforeEach(function(done) {
//     // original piece coordinate at (4, 4)
//     boardWithClearPath = [
//     ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
//     ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, null, null, null, null, null],
//     [null, null, null, null, 'o1', null, null, null],
//     [null, null, null, null, null, null, null, null],
//     ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//     ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
//     ];
//     // destination piece 1 coordinate at (2, 2)
//     boardWithUnclearPath = [
//     ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
//     ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
//     [null, null, 'd1', null, null, null, null, null],
//     [null, null, null, null, null, 'd2', null, null],
//     [null, null, null, null, 'o1', null, null, null],
//     [null, null, null, 'd3', null, 'd4', null, null],
//     ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
//     ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
//     ];
//     origin = [4,4];
//     dest = [2, 2];
//     blackCapPieces = [];
//     whiteCapPieces = [];
//     });
//     it('should return true when path is clear', function(done) {
//       expect(isLegalMove.isDiagPathClear(boardWithClearPath, origin, dest)).to.equal(true);
//     });
//   });
