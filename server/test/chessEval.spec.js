const expect = require('chai').expect;

const chessEval = require('../chess/chessEval');

describe('【ChessEval】 Evaluat Positioning / Game Metrics', () => {

  describe('Compute Captured Pieces Score', () => {

    const capturedPiecesScore = chessEval.capturedPiecesScore;

    it('capturedPiecesScore should exist and should be function', () => {
      expect(capturedPiecesScore).to.be.a('function');
    });

    let capturedWhite = [];
    let capturedBlack = [];

    it('should return 0 if no pieces are captured', () => {
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(0);
    });

    it('should return value of pieces captured by White', () => {
      capturedWhite = ['BP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(2);

      capturedWhite = ['BQ'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(23.75);

      capturedWhite = ['BQ', 'BP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(25.75);

      capturedWhite = ['BP', 'BN', 'BB', 'BR', 'BQ', 'BK'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(
        2 + 9.25 + 9.75 + 15 + 23.75 + 2);
    });

    it('should return value of pieces captured by Black', () => {
      capturedWhite = [];
      capturedBlack = ['WP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-2);

      capturedBlack = ['WQ'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-23.75);

      capturedBlack = ['WQ', 'WP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-25.75);

      capturedBlack = ['WP', 'WN', 'WB', 'WR', 'WQ', 'WK'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(
        -(2 + 9.25 + 9.75 + 15 + 23.75 + 2));
    });

    it('should return net value of pieces captured by White vs Black', () => {
      capturedWhite = ['BP'];
      capturedBlack = ['WP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(0);
      capturedBlack = ['WP', 'WQ'];

      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-23.75);
      capturedBlack = ['WQ', 'WP', 'WP'];

      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-25.75);
      capturedBlack = ['WP', 'WN', 'WB', 'WR', 'WQ', 'WK', 'WP'];

      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(
        -(2 + 9.25 + 9.75 + 15 + 23.75 + 2));

      capturedWhite = ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'];
      capturedBlack = ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(2);

      // theoretical test for King end game value
      capturedWhite = ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BK'];
      capturedBlack = ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(2);
    });

    it('should return end game value of pieces captured by White vs Black', () => {
      capturedWhite = ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'];
      capturedBlack = ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(0);

      capturedBlack = ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WR'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-11.25);

      capturedBlack = ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WK'];
      expect(capturedPiecesScore(capturedWhite, capturedBlack)).to.eql(-2.75);
    });
  });

  describe('Find Piece Position', () => {

    const findPiecePosition = chessEval.findPiecePosition;

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

    it('findPiecePosition should exist and should be function', () => {
      expect(findPiecePosition).to.be.a('function');
    });

    it('should return undefined if piece position is not found captured', () => {
      expect(findPiecePosition('QQ', board)).to.eql(undefined);
      expect(findPiecePosition('WE', board)).to.eql(undefined);
      expect(findPiecePosition('BA', board)).to.eql(undefined);
    });

    it('should find the kings', () => {
      expect(findPiecePosition('WK', board)).to.eql([7, 3]);
      expect(findPiecePosition('BK', board)).to.eql([0, 3]);

      const board2 = [
        ['BR', 'BN', 'BB', null, 'BQ', 'BB', 'BN', 'BR'],
        ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, 'BK', null, null],
        [null, 'WK', null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
        ['WR', 'WN', 'WB', null, 'WQ', 'WB', 'WN', 'WR'],
      ];
      expect(findPiecePosition('WK', board2)).to.eql([4, 1]);
      expect(findPiecePosition('BK', board2)).to.eql([3, 5]);
    });
  });
});
