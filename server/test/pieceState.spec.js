const expect = require('chai').expect;

const pieceState = require('../chess/pieceState');

const { evalPieceState } = pieceState;

const board = [
  ['BR', null, null, 'BQ', 'BK', null, null, 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', null, 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', null, null, 'WQ', 'WK', null, null, 'WR'],
];

const state = {
  hasMovedWK: false,
  hasMovedWKR: false,
  hasMovedWQR: false,
  hasMovedBK: false,
  hasMovedBKR: false,
  hasMovedBQR: false,
  canEnPassantW: '',
  canEnPassantB: '',
};

describe('Evaluate piece state: ', () => {
  it('should exist and should be a function', () => {
    expect(evalPieceState).to.be.a('function');
  });

  it('should not change state for moves that do not affect state', () => {
    expect(evalPieceState(board, ['73', '72'], 'W', state)).to.deep.eql(state);
    expect(evalPieceState(board, ['03', '02'], 'B', state)).to.deep.eql(state);
  });

  it('should change state for King moves', () => {
    expect(evalPieceState(board, ['74', '75'], 'W', state)).to.not.deep.eql(state);
    expect(evalPieceState(board, ['74', '75'], 'W', state).hasMovedWK).to.eql(true);
    expect(evalPieceState(board, ['04', '05'], 'B', state)).to.not.deep.eql(state);
    expect(evalPieceState(board, ['04', '05'], 'B', state).hasMovedBK).to.eql(true);
  });

  it('should change state for Rook moves', () => {
    expect(evalPieceState(board, ['00', '01'], 'B', state)).to.not.deep.eql(state);
    expect(evalPieceState(board, ['00', '01'], 'B', state).hasMovedBQR).to.eql(true);
    expect(evalPieceState(board, ['07', '06'], 'B', state).hasMovedBKR).to.eql(true);
    expect(evalPieceState(board, ['70', '71'], 'W', state).hasMovedWQR).to.eql(true);
    expect(evalPieceState(board, ['77', '76'], 'W', state).hasMovedWKR).to.eql(true);
  });

  it('should change state after castling', () => {
    let newState = evalPieceState(board, { move: 'castle', color: 'W', side: 'O-O' }, 'W', state);
    expect(newState.hasMovedWK).to.eql(true);
    expect(newState.hasMovedWKR).to.eql(true);
    newState = evalPieceState(board, { move: 'castle', color: 'W', side: 'O-O-O' }, 'W', state);
    expect(newState.hasMovedWK).to.eql(true);
    expect(newState.hasMovedWQR).to.eql(true);
    newState = evalPieceState(board, { move: 'castle', color: 'W', side: 'O-O' }, 'B', state);
    expect(newState.hasMovedBK).to.eql(true);
    expect(newState.hasMovedBKR).to.eql(true);
    newState = evalPieceState(board, { move: 'castle', color: 'W', side: 'O-O-O' }, 'B', state);
    expect(newState.hasMovedBK).to.eql(true);
    expect(newState.hasMovedBQR).to.eql(true);
  });

  it('should change state for enpassant', () => {
    expect(evalPieceState(board, ['60', '40'], 'W', state).canEnPassantB).to.eql('40');
    expect(evalPieceState(board, ['10', '30'], 'B', state).canEnPassantW).to.eql('30');
  });
});
