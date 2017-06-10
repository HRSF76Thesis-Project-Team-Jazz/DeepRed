const expect = require('chai').expect;

const deepRed = require('../chess/deepRed');

const { whiteIsChecked, piecesAttackeByBlack } = deepRed.attacksBlack;
const { blackIsChecked, piecesAttackedByWhite } = deepRed.attacksWhite;
const { findPiecePosition, mutateBoard } = deepRed.basic;
const { showMovesByPiece, showEvaluatedMoves } = deepRed.display;
const {
  isCheckmateBlack, isCheckmateWhite,
  isStalemateBlack, isStalemateWhite,
  whiteCanMove, blackCanMove,
} = deepRed.endGameChecks;
const { getAllMovesBlack } = deepRed.movesBlack;
const { getAllMovesWhite } = deepRed.movesWhite;
const { getSafeMovesWhite, getSafeMovesBlack } = deepRed.safeMoves;
const { getAllMovesWithSpecialWhite, getAllMovesWithSpecialBlack } = deepRed.specialMoves;

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

describe('Find Piece Position', () => {

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

  it('findPiecePosition should exist and should be function', () => {
    expect(findPiecePosition).to.be.a('function');
  });

  it('should return empty array if piece position is not found captured', () => {
    expect(findPiecePosition('QQ', board)).to.eql([]);
    expect(findPiecePosition('WE', board)).to.eql([]);
    expect(findPiecePosition('BA', board)).to.eql([]);
  });

  it('should find the kings', () => {
    expect(findPiecePosition('WK', board)).to.eql([[7, 4]]);
    expect(findPiecePosition('BK', board)).to.eql([[0, 4]]);

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
    expect(findPiecePosition('WK', board2)).to.eql([[4, 1]]);
    expect(findPiecePosition('BK', board2)).to.eql([[3, 5]]);
  });

  it('should find multiple pieces', () => {
    expect(findPiecePosition('WR', board)).to.eql([[7, 0], [7, 7]]);
    expect(findPiecePosition('BR', board)).to.eql([[0, 0], [0, 7]]);
  });
});

describe('[Deep Red] evaluate available possible moves: ', () => {

  describe('Check available moves for white', () => {
    it('getAllMovesWhite should exist and should be function', () => {
      expect(getAllMovesWhite).to.be.a('function');
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
        expect(getAllMovesWhite(board)).to.eql(expected);
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
        expect(getAllMovesWhite(board)[63]).to.eql([]);
      });

      it('should show piece capture moves', () => {
        let result = getAllMovesWhite(board)[62];
        result = result.map(x => JSON.stringify(x));
        expect(result).to.deep.include(JSON.stringify([5, 3]));

        result = getAllMovesWhite(board)[64];
        result = result.map(x => JSON.stringify(x));
        expect(result).to.deep.include(JSON.stringify([5, 3]));
      });
    });

    /**
     * TO DO: IMPLEMENT MOVEMENT FOR PIECES
     */
  });
});

describe('Mutate Board', () => {
  const board = [
    [null, null, null, null, null, null, 'BN', null],
    [null, null, null, null, null, null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const wkCastleBoard = [
    [null, null, null, null, null, null, 'BN', null],
    [null, null, null, null, null, null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, null, 'WR', 'WK', null],
  ];

  const wqCastleBoard = [
    [null, null, null, null, null, null, 'BN', null],
    [null, null, null, null, null, null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, 'WK', 'WR', null, null, null, 'WR'],
  ];

  const enPassantBoard = [
    [null, null, null, null, null, null, 'BN', null],
    [null, null, null, null, null, null, null, 'WP'],
    [null, 'WP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const pawnPromotionAdvanceBoard = [
    [null, null, null, null, null, null, 'BN', 'WQ'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const pawnPromotionCaptureBoard = [
    [null, null, null, null, null, null, 'WQ', null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  it('should handle castling', () => {
    expect(mutateBoard(board, { move: 'castle', color: 'W', side: 'O-O' })).to.deep.equal(wkCastleBoard);
    expect(mutateBoard(board, { move: 'castle', color: 'W', side: 'O-O-O' })).to.deep.equal(wqCastleBoard);
  });

  it('should handle enpassant', () => {
    expect(mutateBoard(board, { move: 'enpassant', from: '30', to: '21', captured: '31', color: 'W' })).to.deep.equal(enPassantBoard);
  });

  it('should handle pawn promotion', () => {
    expect(mutateBoard(board, { move: 'pawnPromotion', from: '17', to: '07', newPiece: 'WQ' })).to.deep.equal(pawnPromotionAdvanceBoard);
    expect(mutateBoard(board, { move: 'pawnPromotion', from: '17', to: '06', newPiece: 'WQ' })).to.deep.equal(pawnPromotionCaptureBoard);
  });
});

describe('Get all safe moves', () => {
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

  const wbCanNotMove = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WB', null, null, null, null],
    [null, null, null, 'WK', null, null, null, null],
  ];

  const canNotEnPassant = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WP', 'BP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WK', null, null, null, null],
  ];

  const epState = Object.assign({}, pieceState, { canEnPassantW: '04' });

  const canNotPawnPromoteByCapture = [
    [null, null, null, 'BB', 'BN', null, null, null],
    [null, null, null, 'WP', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WK', null, null, null, null],
  ];

  it('Get all safe moves should exist and should be functions', () => {
    expect(getSafeMovesWhite).to.be.a('function');
    expect(getSafeMovesBlack).to.be.a('function');
  });

  it('should not allow for moves that endanger the King', () => {
    expect(getSafeMovesWhite(wbCanNotMove, pieceState)).to.have.property('63');
    wbCanNotMove[0][3] = 'BR';
    expect(getSafeMovesWhite(wbCanNotMove, pieceState)['63'].length).to.eql(0);
  });


  it('should not allow for En Passant that endangers the King', () => {
    expect(getSafeMovesWhite(canNotEnPassant, epState)).to.have.property('specialMoves');
    canNotEnPassant[0][3] = 'BR';
    expect(getSafeMovesWhite(canNotEnPassant, epState)).to.not.have.property('specialMoves');
  });

  it('should not allow for Pawn Promotion that endangers the King', () => {
    expect(getSafeMovesWhite(canNotPawnPromoteByCapture, pieceState)).to.have.property('specialMoves');
    canNotPawnPromoteByCapture[0][3] = 'BR';
    expect(getSafeMovesWhite(canNotPawnPromoteByCapture, pieceState)).to.not.have.property('specialMoves');
  });

});
