const expect = require('chai').expect;

const deepRed = require('../chess/deepRed');

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

describe('[Deep Red] evaluate available possible moves: ', () => {
  const getAllMovesWhite = deepRed.getAllMovesWhite;

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
    expect(deepRed.getAllMovesWhite(board, pieceState).specialMoves).to.include.members(['O-O', 'O-O-O']);
  });

  it('should know that castling is disallowed if K or R have moved', () => {
    expect(deepRed.getAllMovesWhite(board, kingMovedState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(board, whiteKRMovedState).specialMoves).to.not.include('O-O');
    expect(deepRed.getAllMovesWhite(board, whiteQRMovedState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if the path is blocked', () => {
    expect(deepRed.getAllMovesWhite(blockedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(deepRed.getAllMovesWhite(blockedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if K or the path is attacked', () => {
    expect(deepRed.getAllMovesWhite(checkBoard, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(attackedCastleBoard, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(attackedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(deepRed.getAllMovesWhite(attackedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
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
    expect(deepRed.getAllMovesBlack(board, pieceState).specialMoves).to.include.members(['O-O', 'O-O-O']);
  });

  it('should know that castling is disallowed if K or R have moved', () => {
    expect(deepRed.getAllMovesBlack(board, kingMovedState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(board, blackKRMovedState).specialMoves).to.not.include('O-O');
    expect(deepRed.getAllMovesBlack(board, blackQRMovedState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if the path is blocked', () => {
    expect(deepRed.getAllMovesBlack(blockedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(deepRed.getAllMovesBlack(blockedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
  });

  it('should know that castling is not allowed if K or the path is attacked', () => {
    expect(deepRed.getAllMovesBlack(checkBoard, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(attackedCastleBoard, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(attackedKRBoard, pieceState).specialMoves).to.not.include('O-O');
    expect(deepRed.getAllMovesBlack(attackedQRBoard, pieceState).specialMoves).to.not.include('O-O-O');
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
    expect(deepRed.getAllMovesWhite(board, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant0, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant1, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant3, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant7, pieceState)).to.not.have.property('specialMoves');
  });

  it('should know that en-passant is available', () => {
    expect(deepRed.getAllMovesWhite(enPassant0, ep0State)).to.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant1, ep1State)).to.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant3, ep3State)).to.have.property('specialMoves');
    expect(deepRed.getAllMovesWhite(enPassant7, ep7State)).to.have.property('specialMoves');
  });

  it('should know what en-passant moves are available', () => {
    expect(deepRed.getAllMovesWhite(enPassant0, ep0State).specialMoves).to.deep.include({ move: 'enpassant', from: '31', to: '20', captured: '30' });
    expect(deepRed.getAllMovesWhite(enPassant1, ep1State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '30', to: '21', captured: '31' }, { move: 'enpassant', from: '32', to: '21', captured: '31' }]);
    expect(deepRed.getAllMovesWhite(enPassant3, ep3State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '32', to: '23', captured: '33' }, { move: 'enpassant', from: '34', to: '23', captured: '33' }]);
    expect(deepRed.getAllMovesWhite(enPassant7, ep7State).specialMoves).to.deep.include({ move: 'enpassant', from: '36', to: '27', captured: '37' });
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
    expect(deepRed.getAllMovesBlack(board, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant0, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant1, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant3, pieceState)).to.not.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant7, pieceState)).to.not.have.property('specialMoves');
  });

  it('should know that en-passant is available', () => {
    expect(deepRed.getAllMovesBlack(enPassant0, ep0State)).to.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant1, ep1State)).to.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant3, ep3State)).to.have.property('specialMoves');
    expect(deepRed.getAllMovesBlack(enPassant7, ep7State)).to.have.property('specialMoves');
  });

  it('should know what en-passant moves are available', () => {
    expect(deepRed.getAllMovesBlack(enPassant0, ep0State).specialMoves).to.deep.include({ move: 'enpassant', from: '41', to: '50', captured: '40' });
    expect(deepRed.getAllMovesBlack(enPassant1, ep1State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '40', to: '51', captured: '41' }, { move: 'enpassant', from: '42', to: '51', captured: '41' }]);
    expect(deepRed.getAllMovesBlack(enPassant3, ep3State).specialMoves).to.deep.include.members([{ move: 'enpassant', from: '42', to: '53', captured: '43' }, { move: 'enpassant', from: '44', to: '53', captured: '43' }]);
    expect(deepRed.getAllMovesBlack(enPassant7, ep7State).specialMoves).to.deep.include({ move: 'enpassant', from: '46', to: '57', captured: '47' });
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
      expect(deepRed.blackCanMove(checkmateBoard)).to.eql(false);
      expect(deepRed.blackCanMove(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(deepRed.isCheckmateBlack(board)).to.eql(false);
      expect(deepRed.isCheckmateBlack(safeBoard)).to.eql(false);
      expect(deepRed.isCheckmateBlack(checkmateBoard)).to.eql(true);
      expect(deepRed.isCheckmateBlack(stalemateBoard)).to.eql(false);
    });

    it('should check if black is in checkmate', () => {
      expect(deepRed.isStalemateBlack(board)).to.eql(false);
      expect(deepRed.isStalemateBlack(safeBoard)).to.eql(false);
      expect(deepRed.isStalemateBlack(checkmateBoard)).to.eql(false);
      expect(deepRed.isStalemateBlack(stalemateBoard)).to.eql(true);
    });
  });


});
