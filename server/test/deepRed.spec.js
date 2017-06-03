const expect = require('chai').expect;

const deepRed = require('../chess/deepRed');

describe('【Deep Red】 evaluate available possible moves: ', () => {
  const getAvailableMovesWhite = deepRed.getAvailableMovesWhite;

  describe('Check available moves for white', () => {
    it('getAvailableMovesWhite should exist and should be function', () => {
      expect(getAvailableMovesWhite).to.be.a('function');
    });

    describe('[White pawn movement]', () => {
      it('should return pawn moves: move 1 or 2 spaces on start', () => {

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

        const expected = {
          60: [[5, 0], [4, 0]],
          61: [[5, 1], [4, 1]],
          62: [[5, 2], [4, 2]],
          63: [[5, 3], [4, 3]],
          64: [[5, 4], [4, 4]],
          65: [[5, 5], [4, 5]],
          66: [[5, 6], [4, 6]],
          67: [[5, 7], [4, 7]],
          70: [],
          71: [[5, 0], [5, 2]],
          72: [],
          73: [],
          74: [],
          75: [],
          76: [[5, 5], [5, 7]],
          77: [],
        };
        expect(getAvailableMovesWhite(board)).to.eql(expected);
      });
    });

    describe('Check available moves for adjacent pawns', () => {
      const board = [
        ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
        ['BP', 'BP', 'BP', null, 'BP', 'BP', 'BP', 'BP'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, 'BP', null, null, null, null],
        ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
        ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
      ];

      it('should not be able to move blocked pawns', () => {
        expect(getAvailableMovesWhite(board)[63]).to.eql([]);
      });

      it('should show piece capture moves', () => {
        let result = getAvailableMovesWhite(board)[62];
        result = result.map(x => JSON.stringify(x));
        expect(result).to.deep.include(JSON.stringify([5, 3]));

        result = getAvailableMovesWhite(board)[64];
        result = result.map(x => JSON.stringify(x));
        expect(result).to.deep.include(JSON.stringify([5, 3]));
      });
    });

    /**
     * TO DO: IMPLEMENT MOVEMENT FOR PIECES
     */

  });
});

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
      expect(deepRed.whiteCanMove).to.be.a('function');
      expect(deepRed.isCheckmateWhite).to.be.a('function');
      expect(deepRed.isStalemateWhite).to.be.a('function');
    });

    it('should check if white has valid available moves', () => {
      expect(deepRed.whiteCanMove(board)).to.eql(true);
      expect(deepRed.whiteCanMove(safeBoard)).to.eql(true);
      expect(deepRed.whiteCanMove(checkmateBoard)).to.eql(false);
      expect(deepRed.whiteCanMove(stalemateBoard)).to.eql(false);
    });

    it('should check if white is in checkmate', () => {
      expect(deepRed.isCheckmateWhite(board)).to.eql(false);
      expect(deepRed.isCheckmateWhite(safeBoard)).to.eql(false);
      expect(deepRed.isCheckmateWhite(checkmateBoard)).to.eql(true);
      expect(deepRed.isCheckmateWhite(stalemateBoard)).to.eql(false);
    });

    it('should check if white is in checkmate', () => {
      expect(deepRed.isStalemateWhite(board)).to.eql(false);
      expect(deepRed.isStalemateWhite(safeBoard)).to.eql(false);
      expect(deepRed.isStalemateWhite(checkmateBoard)).to.eql(false);
      expect(deepRed.isStalemateWhite(stalemateBoard)).to.eql(true);
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
      expect(deepRed.blackCanMove).to.be.a('function');
      expect(deepRed.isCheckmateBlack).to.be.a('function');
      expect(deepRed.isStalemateBlack).to.be.a('function');
    });

    it('should check if black has valid available moves', () => {
      expect(deepRed.blackCanMove(board)).to.eql(true);
      expect(deepRed.blackCanMove(safeBoard)).to.eql(true);
      // expect(deepRed.blackCanMove(checkmateBoard)).to.eql(false);
      // expect(deepRed.blackCanMove(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(deepRed.isCheckmateBlack(board)).to.eql(false);
      expect(deepRed.isCheckmateBlack(safeBoard)).to.eql(false);
      // expect(deepRed.isCheckmateBlack(checkmateBoard)).to.eql(true);
      // expect(deepRed.isCheckmateBlack(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(deepRed.isStalemateBlack(board)).to.eql(false);
      expect(deepRed.isStalemateBlack(safeBoard)).to.eql(false);
      expect(deepRed.isStalemateBlack(checkmateBoard)).to.eql(false);
      // expect(deepRed.isStalemateBlack(stalemateBoard)).to.eql(true);
    });
  });
});
