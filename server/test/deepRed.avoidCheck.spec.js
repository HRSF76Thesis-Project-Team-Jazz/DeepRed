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

describe('Should know when King is in check: ', () => {
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

  const wkBQCheck = [
    [null, null, null, 'BQ', null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', null, 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR'],
  ];

  const wkBPCheck = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, 'BP', null],
    [null, null, null, null, null, null, null, 'WK'],
  ];

  const bkWPCheck = [
    ['BK', null, null, null, null, null, null, null],
    [null, 'WP', null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, 'WK'],
  ];

  console.log(getSafeMovesWhite(bkWPCheck));
  
  const bkWQCheck = [
    ['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', null, 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, 'WQ', null, null, null, null],
  ];

  it('checks should exist and should be functions', () => {
    expect(whiteIsChecked).to.be.a('function');
    expect(blackIsChecked).to.be.a('function');
  });

  it('should know when the White King is in check', () => {
    expect(whiteIsChecked(board)).to.eql(false);
    expect(whiteIsChecked(wkBQCheck)).to.eql(true);
    expect(whiteIsChecked(wkBPCheck)).to.eql(true);
    expect(blackIsChecked(board)).to.eql(false);
    expect(blackIsChecked(bkWQCheck)).to.eql(true);
    expect(blackIsChecked(bkWPCheck)).to.eql(true);
  });

});
