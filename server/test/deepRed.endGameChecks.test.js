const expect = require('chai').expect;

const deepRed = require('../chess/deepRed');

const {
  isCheckmateBlack, isCheckmateWhite,
  isStalemateBlack, isStalemateWhite,
  whiteCanMove, blackCanMove,
} = deepRed.endGameChecks;

describe('End of game checks', () => {
  describe('[White] End of game checks', () => {
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

    const safeBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, 'BR', null, null, null, null, null],
      [null, null, null, 'WK', null, null, null, 'BR'],
    ];

    const checkmateBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['BR', null, null, null, null, null, null, null],
      [null, null, null, 'WK', null, null, null, 'BR'],
    ];

    const stalemateBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, 'BB', null, null, null, null, null],
      [null, null, 'BQ', null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, 'WK', null, null, null, null],
    ];

    it('End game function checks should exist and should be functions', () => {
      expect(whiteCanMove).to.be.a('function');
      expect(isCheckmateWhite).to.be.a('function');
      expect(isStalemateWhite).to.be.a('function');
    });

    it('should check if white has valid available moves', () => {
      expect(whiteCanMove(board)).to.eql(true);
      expect(whiteCanMove(safeBoard)).to.eql(true);
      expect(whiteCanMove(checkmateBoard)).to.eql(false);
      expect(whiteCanMove(stalemateBoard)).to.eql(false);
    });

    it('should check if white is in checkmate', () => {
      expect(isCheckmateBlack(board)).to.eql(false);
      expect(isCheckmateBlack(safeBoard)).to.eql(false);
      expect(isCheckmateBlack(checkmateBoard)).to.eql(true);
      expect(isCheckmateBlack(stalemateBoard)).to.eql(false);
    });

    it('should check if white is in checkmate', () => {
      expect(isStalemateWhite(board)).to.eql(false);
      expect(isStalemateWhite(safeBoard)).to.eql(false);
      expect(isStalemateWhite(checkmateBoard)).to.eql(false);
      expect(isStalemateWhite(stalemateBoard)).to.eql(true);
    });
  });

  describe('[Black] End of game checks', () => {
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

    const safeBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, 'WR', null, null, null, null, null],
      [null, null, null, 'BK', null, null, null, 'WR'],
    ];

    const checkmateBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WR', null, null, null, null, null, null, null],
      [null, null, null, 'BK', null, null, null, 'WR'],
    ];

    const stalemateBoard = [
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, 'WB', null, null, null, null, null],
      [null, null, 'WQ', null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, 'BK', null, null, null, null],
    ];

    it('End game function checks should exist and should be functions', () => {
      expect(blackCanMove).to.be.a('function');
      expect(isCheckmateBlack).to.be.a('function');
      expect(isStalemateBlack).to.be.a('function');
    });

    it('should check if black has valid available moves', () => {
      expect(blackCanMove(board)).to.eql(true);
      expect(blackCanMove(safeBoard)).to.eql(true);
      expect(blackCanMove(checkmateBoard)).to.eql(false);
      expect(blackCanMove(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(isCheckmateWhite(board)).to.eql(false);
      expect(isCheckmateWhite(safeBoard)).to.eql(false);
      expect(isCheckmateWhite(checkmateBoard)).to.eql(true);
      expect(isCheckmateWhite(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(isStalemateBlack(board)).to.eql(false);
      expect(isStalemateBlack(safeBoard)).to.eql(false);
      expect(isStalemateBlack(checkmateBoard)).to.eql(false);
      expect(isStalemateBlack(stalemateBoard)).to.eql(true);
    });
  });
});
