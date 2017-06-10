const expect = require('chai').expect;

const deepRed = require('../chess/deepRed');

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


