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

  it('should return empty array if piece position is not found captured', () => {
    expect(findPiecePosition('QQ', board)).to.eql([]);
    expect(findPiecePosition('WE', board)).to.eql([]);
    expect(findPiecePosition('BA', board)).to.eql([]);
  });

  it('should find the kings', () => {
    expect(findPiecePosition('WK', board)).to.eql([[7, 3]]);
    expect(findPiecePosition('BK', board)).to.eql([[0, 3]]);

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

describe('[White] Check Castling', () => {
  const board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const blockedKRBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', 'WB', null, 'WR'],
  ];

  const blockedQRBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, 'WQ', 'WK', null, null, 'WR'],
  ];

  const checkBoard = [
    [null, null, null, null, 'BR', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const attackedCastleBoard = [
    [null, null, null, 'BR', null, 'BR', null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const attackedKRBoard = [
    [null, null, null, null, null, 'BR', null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const attackedQRBoard = [
    [null, null, null, 'BR', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', null, null, null, 'WK', null, null, 'WR'],
  ];

  const kingMovedState = Object.assign({}, pieceState, { hasMovedWK: true });
  const whiteKRMovedState = Object.assign({}, pieceState, { hasMovedWKR: true });
  const whiteQRMovedState = Object.assign({}, pieceState, { hasMovedWQR: true });

  it('should know that castling is available', () => {
    expect(getAllMovesWithSpecialWhite(board, pieceState).specialMoves).to.deep.include.members([{ move: 'castle', color: 'W', side: 'O-O' },
     { move: 'castle', color: 'W', side: 'O-O-O' }]);
  });

  it('should know that castling is disallowed if K or R have moved', () => {
    expect(getAllMovesWithSpecialWhite(board, kingMovedState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(board, whiteKRMovedState).specialMoves).to.not.include('O-O');
    expect(getAllMovesWithSpecialWhite(board, whiteQRMovedState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if the path is blocked', () => {
    expect(getAllMovesWithSpecialWhite(blockedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(getAllMovesWithSpecialWhite(blockedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if K or the path is attacked', () => {
    expect(getAllMovesWithSpecialWhite(checkBoard, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(attackedCastleBoard, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(attackedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(getAllMovesWithSpecialWhite(attackedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
  });
});

describe('[Black] Check Castling', () => {
  const board = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const blockedKRBoard = [
    ['BR', null, null, null, 'BK', 'BB', null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const blockedQRBoard = [
    ['BR', null, null, 'BQ', 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const checkBoard = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, 'WR', null, null, null],
  ];

  const attackedCastleBoard = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WR', null, 'WR', null, null],
  ];

  const attackedKRBoard = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, 'WR', null, null],
  ];

  const attackedQRBoard = [
    ['BR', null, null, null, 'BK', null, null, 'BR'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WR', null, null, null, null],
  ];

  const kingMovedState = Object.assign({}, pieceState, { hasMovedBK: true });
  const blackKRMovedState = Object.assign({}, pieceState, { hasMovedBKR: true });
  const blackQRMovedState = Object.assign({}, pieceState, { hasMovedBQR: true });

  it('should know that castling is available', () => {
    expect(getAllMovesWithSpecialBlack(board, pieceState).specialMoves).to.deep.include.members([{ move: 'castle', color: 'B', side: 'O-O' },
     { move: 'castle', color: 'B', side: 'O-O-O' }]);
  });

  it('should know that castling is disallowed if K or R have moved', () => {
    expect(getAllMovesWithSpecialBlack(board, kingMovedState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(board, blackKRMovedState).specialMoves).to.deep.not.include({ move: 'castle', color: 'B', side: 'O-O' });
    expect(getAllMovesWithSpecialBlack(board, blackQRMovedState).specialMoves).to.deep.not.include({ move: 'castle', color: 'B', side: 'O-O-O' });
  });

  it('should know that castling is not allowed if the path is blocked', () => {
    expect(getAllMovesWithSpecialBlack(blockedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(getAllMovesWithSpecialBlack(blockedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if K or the path is attacked', () => {
    expect(getAllMovesWithSpecialBlack(checkBoard, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(attackedCastleBoard, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(attackedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(getAllMovesWithSpecialBlack(attackedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
  });
});

describe('[White] En-Passant', () => {
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

  const enPassant0 = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    [null, 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    ['BP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', null, null, null, null, null, null, null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const enPassant1 = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', null, 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', 'WP', null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'WP', null, 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const enPassant3 = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, 'WP', 'BP', 'WP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', null, 'WP', null, 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const enPassant7 = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'WP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const ep0State = Object.assign({}, pieceState, { canEnPassantW: '30' });
  const ep1State = Object.assign({}, pieceState, { canEnPassantW: '31' });
  const ep3State = Object.assign({}, pieceState, { canEnPassantW: '33' });
  const ep7State = Object.assign({}, pieceState, { canEnPassantW: '37' });

  it('should know that en-passant is not available', () => {
    expect(getAllMovesWithSpecialWhite(board, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant0, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant1, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant3, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant7, pieceState)).to.not.have.property('specialMoves');
  });

  it('should know that en-passant is available', () => {
    expect(getAllMovesWithSpecialWhite(enPassant0, ep0State)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant1, ep1State)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant3, ep3State)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(enPassant7, ep7State)).to.have.property('specialMoves');
  });

  it('should know what en-passant moves are available', () => {
    expect(getAllMovesWithSpecialWhite(enPassant0, ep0State).specialMoves).to.deep.include({ move: 'enpassant', from: '31', to: '20', captured: '30', color: 'W' });
    expect(getAllMovesWithSpecialWhite(enPassant1, ep1State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '30', to: '21', captured: '31', color: 'W' }, { move: 'enpassant', from: '32', to: '21', captured: '31', color: 'W' }]);
    expect(getAllMovesWithSpecialWhite(enPassant3, ep3State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '32', to: '23', captured: '33', color: 'W' }, { move: 'enpassant', from: '34', to: '23', captured: '33', color: 'W' }]);
    expect(getAllMovesWithSpecialWhite(enPassant7, ep7State).specialMoves).to.deep.include({ move: 'enpassant', from: '36', to: '27', captured: '37', color: 'W' });
  });
});

describe('[Black] En-Passant', () => {
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

  const enPassant0 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const enPassant1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', 'WP', 'BP', null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const enPassant3 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, 'BP', 'WP', 'BP', null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const enPassant7 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'BP', 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const ep0State = Object.assign({}, pieceState, { canEnPassantB: '40' });
  const ep1State = Object.assign({}, pieceState, { canEnPassantB: '41' });
  const ep3State = Object.assign({}, pieceState, { canEnPassantB: '43' });
  const ep7State = Object.assign({}, pieceState, { canEnPassantB: '47' });

  it('should know that en-passant is not available', () => {
    expect(getAllMovesWithSpecialBlack(board, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant0, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant1, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant3, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant7, pieceState)).to.not.have.property('specialMoves');
  });

  it('should know that en-passant is available', () => {
    expect(getAllMovesWithSpecialBlack(enPassant0, ep0State)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant1, ep1State)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant3, ep3State)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(enPassant7, ep7State)).to.have.property('specialMoves');
  });

  it('should know what en-passant moves are available', () => {
    expect(getAllMovesWithSpecialBlack(enPassant0, ep0State).specialMoves).to.deep.include({ move: 'enpassant', from: '41', to: '50', captured: '40', color: 'B' });
    expect(getAllMovesWithSpecialBlack(enPassant1, ep1State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '40', to: '51', captured: '41', color: 'B' }, { move: 'enpassant', from: '42', to: '51', captured: '41', color: 'B' }]);
    expect(getAllMovesWithSpecialBlack(enPassant3, ep3State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '42', to: '53', captured: '43', color: 'B' }, { move: 'enpassant', from: '44', to: '53', captured: '43', color: 'B' }]);
    expect(getAllMovesWithSpecialBlack(enPassant7, ep7State).specialMoves).to.deep.include({ move: 'enpassant', from: '46', to: '57', captured: '47', color: 'B' });
  });
});

describe('[White] Pawn promotion', () => {
  const board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const pawn0Blocked = [
    ['BR', null, null, null, null, null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn0 = [
    [null, null, null, null, null, null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn1 = [
    [null, null, null, null, null, null, null, null],
    [null, 'WP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, 'WP', null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn07 = [
    [null, null, null, null, null, null, null, null],
    ['WP', null, null, null, null, null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn0capture1 = [
    ['BR', 'BN', null, null, null, null, null, null],
    ['WP', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn1capture0 = [
    ['BN', 'BN', null, null, null, null, null, null],
    [null, 'WP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn7capture6 = [
    [null, null, null, null, null, null, 'BN', 'BR'],
    [null, null, null, null, null, null, null, 'WP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  it('should know that pawn promotion is not available', () => {
    expect(getAllMovesWithSpecialWhite(board, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(pawn0Blocked, pieceState)).to.not.have.property('specialMoves');
  });

  it('should know that pawn promotion is available', () => {
    expect(getAllMovesWithSpecialWhite(pawn0, pieceState)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(pawn1, pieceState)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(pawn2, pieceState)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialWhite(pawn07, pieceState)).to.have.property('specialMoves');
  });

  it('should know what pawn promotion moves are available', () => {
    expect(getAllMovesWithSpecialWhite(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '10', to: '00', newPiece: 'WQ' });
    expect(getAllMovesWithSpecialWhite(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '10', to: '00', newPiece: 'WR' });
    expect(getAllMovesWithSpecialWhite(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '10', to: '00', newPiece: 'WB' });
    expect(getAllMovesWithSpecialWhite(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '10', to: '00', newPiece: 'WN' });

    expect(getAllMovesWithSpecialWhite(pawn1, pieceState).specialMoves).to.deep.include.members([{ move: 'pawnPromotion', from: '11', to: '01', newPiece: 'WQ' }, { move: 'pawnPromotion', from: '11', to: '01', newPiece: 'WR' }]);
    expect(getAllMovesWithSpecialWhite(pawn2, pieceState).specialMoves).to.deep.include.members([{ move: 'pawnPromotion', from: '12', to: '02', newPiece: 'WQ' }, { move: 'pawnPromotion', from: '12', to: '02', newPiece: 'WR' }]);
    expect(getAllMovesWithSpecialWhite(pawn07, pieceState).specialMoves).to.deep.include.members([{ move: 'pawnPromotion', from: '10', to: '00', newPiece: 'WQ' }, { move: 'pawnPromotion', from: '17', to: '07', newPiece: 'WQ' }]);
  });

  it('should know what pawn promotions via capture are available', () => {
    expect(getAllMovesWithSpecialWhite(pawn0capture1, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '10', to: '01', newPiece: 'WQ' });
    expect(getAllMovesWithSpecialWhite(pawn1capture0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '11', to: '00', newPiece: 'WB' });
    expect(getAllMovesWithSpecialWhite(pawn7capture6, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '17', to: '06', newPiece: 'WN' });
  });
});

describe('[Black] Pawn promotion', () => {
  const board = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const pawn0Blocked = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', null, null, null, null, null, null, null],
    ['WR', null, null, null, null, null, null, null],
  ];

  const pawn0 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'BP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn2 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, 'BP', null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn07 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', null, null, null, null, null, null, 'BP'],
    [null, null, null, null, null, null, null, null],
  ];

  const pawn0capture1 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['BP', null, null, null, null, null, null, null],
    ['WR', 'WN', null, null, null, null, null, null],
  ];

  const pawn1capture0 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, 'BP', null, null, null, null, null, null],
    ['WN', 'WN', null, null, null, null, null, null],
  ];

  const pawn7capture6 = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, 'BP'],
    [null, null, null, null, null, null, 'WN', 'WR'],
  ];

  it('should know that pawn promotion is not available', () => {
    expect(getAllMovesWithSpecialBlack(board, pieceState)).to.not.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(pawn0Blocked, pieceState)).to.not.have.property('specialMoves');
  });

  it('should know that pawn promotion is available', () => {
    expect(getAllMovesWithSpecialBlack(pawn0, pieceState)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(pawn1, pieceState)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(pawn2, pieceState)).to.have.property('specialMoves');
    expect(getAllMovesWithSpecialBlack(pawn07, pieceState)).to.have.property('specialMoves');
  });

  it('should know what pawn promotion moves are available', () => {
    expect(getAllMovesWithSpecialBlack(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '60', to: '70', newPiece: 'BQ' });
    expect(getAllMovesWithSpecialBlack(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '60', to: '70', newPiece: 'BR' });
    expect(getAllMovesWithSpecialBlack(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '60', to: '70', newPiece: 'BB' });
    expect(getAllMovesWithSpecialBlack(pawn0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '60', to: '70', newPiece: 'BN' });

    expect(getAllMovesWithSpecialBlack(pawn1, pieceState).specialMoves).to.deep.include.members([{ move: 'pawnPromotion', from: '61', to: '71', newPiece: 'BQ' }, { move: 'pawnPromotion', from: '61', to: '71', newPiece: 'BR' }]);
    expect(getAllMovesWithSpecialBlack(pawn2, pieceState).specialMoves).to.deep.include.members([{ move: 'pawnPromotion', from: '62', to: '72', newPiece: 'BQ' }, { move: 'pawnPromotion', from: '62', to: '72', newPiece: 'BR' }]);
    expect(getAllMovesWithSpecialBlack(pawn07, pieceState).specialMoves).to.deep.include.members([{ move: 'pawnPromotion', from: '60', to: '70', newPiece: 'BQ' }, { move: 'pawnPromotion', from: '67', to: '77', newPiece: 'BQ' }]);
  });

  it('should know what pawn promotions via capture are available', () => {
    expect(getAllMovesWithSpecialBlack(pawn0capture1, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '60', to: '71', newPiece: 'BQ' });
    expect(getAllMovesWithSpecialBlack(pawn1capture0, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '61', to: '70', newPiece: 'BB' });
    expect(getAllMovesWithSpecialBlack(pawn7capture6, pieceState).specialMoves).to.deep.include({ move: 'pawnPromotion', from: '67', to: '76', newPiece: 'BN' });
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
      expect(isCheckmateWhite(board)).to.eql(false);
      expect(isCheckmateWhite(safeBoard)).to.eql(false);
      expect(isCheckmateWhite(checkmateBoard)).to.eql(true);
      expect(isCheckmateWhite(stalemateBoard)).to.eql(false);
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
      expect(isCheckmateBlack(board)).to.eql(false);
      expect(isCheckmateBlack(safeBoard)).to.eql(false);
      expect(isCheckmateBlack(checkmateBoard)).to.eql(true);
      expect(isCheckmateBlack(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(isStalemateBlack(board)).to.eql(false);
      expect(isStalemateBlack(safeBoard)).to.eql(false);
      expect(isStalemateBlack(checkmateBoard)).to.eql(false);
      expect(isStalemateBlack(stalemateBoard)).to.eql(true);
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

});
