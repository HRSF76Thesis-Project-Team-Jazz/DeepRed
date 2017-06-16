const expect = require('chai').expect;

const chessEval = require('../chess/chessEval');

const { pieceScore, boardPiecesScore, piecesAttacked } = chessEval;

const pieceState = {
  hasMovedWK: false,
  hasMovedWKR: false,
  hasMovedWQR: false,
  hasMovedBK: false,
  hasMovedBKR: false,
  hasMovedBQR: false,
  canEnPassantW: '',
  canEnPassantB: '',
};

const board = [
  ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
];


describe('【ChessEval】 Evaluate value of pieces: ', () => {
  describe('Compute value of pieces: ', () => {
    it('pieceScore should exist and should be function', () => {
      expect(pieceScore).to.be.a('function');
    });

    it('should return have a value of pieces at the start', () => {
      expect(pieceScore(board)).to.deep.eql({
        P: 2,
        N: 9.25,
        B: 9.75,
        R: 15,
        Q: 23.75,
        K: 2,
      });
    });

    const newBoard = [
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WR', null, null, null, 'WK', null, null, 'WR'],
      [null, null, null, null, null, null, null, null],
    ];

    it('should return have a different piece value during end game', () => {
      console.log(newBoard);
      expect(pieceScore(newBoard)).to.deep.eql({
        P: 3.75,
        N: 9.25,
        B: 9.75,
        R: 15,
        Q: 23.75,
        K: 6.5,
      });
    });
  }); // end of piesScore

  describe('Compute value of board pieces for each player: ', () => {
    it('boardPiecesScore should exist and should be function', () => {
      expect(boardPiecesScore).to.be.a('function');
    });

    it('should return the correct value for white', () => {
      expect(boardPiecesScore(board).whiteScore).to.eql(109.75);
    });

    it('should return the correct value for black', () => {
      expect(boardPiecesScore(board).blackScore).to.eql(109.75);
    });

    const newBoard2 = [
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WR', null, null, null, 'WK', null, null, 'WR'],
      [null, null, null, null, null, null, null, null],
    ];

    it('should return the correct value for white', () => {
      expect(boardPiecesScore(newBoard2).whiteScore).to.eql(36.5);
    });

    it('should return the correct value for black', () => {
      expect(boardPiecesScore(newBoard2).blackScore).to.eql(98.25);
    });

  }); // end of piesScore
  
  describe('Compute value of pieces under attack for each player: ', () => {
    it('piecesAttacked should exist and should be function', () => {
      expect(piecesAttacked).to.be.a('function');
    });

    const attackBoard = [
      [null, null, 'BR', null, 'BK', null, null, 'BR'],
      [null, 'WP', null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WR', null, null, null, 'WK', null, null, 'WR'],
      [null, null, null, null, null, null, null, null],
    ];

    it('should return the correct value for threated white pieces', () => {
      expect(piecesAttacked(attackBoard, pieceState, 'W')).to.eql(15);
    });

    it('should return the correct value for threated white pieces', () => {
      expect(piecesAttacked(attackBoard, pieceState, 'B')).to.eql(30);
    });

    const newBoard2 = [
      ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null, null],
      ['WR', null, null, null, 'WK', null, null, 'WR'],
      [null, null, null, null, null, null, null, null],
    ];
    it('should return the correct value for white', () => {
      expect(boardPiecesScore(newBoard2).whiteScore).to.eql(36.5);
    });

    it('should return the correct value for black', () => {
      expect(boardPiecesScore(newBoard2).blackScore).to.eql(98.25);
    });

  }); // end of piesScore
}); // end of chess eval
