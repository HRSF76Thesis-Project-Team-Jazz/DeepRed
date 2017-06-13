const safeMoves = require('../deepRed/safeMoves');
const pieceState = require('../pieceState');

const {
  getSafeMovesWhite,
  getSafeMovesBlack,
} = safeMoves;

const { evalPieceState } = pieceState;

/**
 * Returns a random move after inputting current game state
 * @param {array} board  : 8 x 8 array board representation
 * @param {string} color : 'W' or 'B'
 * @param {object} currentState : object of current state
 */

const getRandomMove = (board, color, currentState) => {
  const moves = (color === 'W') ?
    getSafeMovesWhite(board, currentState) : getSafeMovesBlack(board, currentState);

  let count = 0;
  const keys = Object.keys(moves);
  let move = {};

  for (let i = 0; i < keys.length; i += 1) {
    count += moves[keys[i]].length;
  }

  const choice = Math.floor(Math.random() * count);

  count = 0;
  for (let i = 0; i < keys.length; i += 1) {
    if ((count + moves[keys[i]].length) > choice) {
      if (keys[i] !== 'specialMoves') {
        move = [keys[i], moves[keys[i]][choice - count]];
      } else {
        move = moves[keys[i]][choice - count];
      }
      break;
    }
    count += moves[keys[i]].length;
  }

  return [move, evalPieceState(board, move, color, currentState)];
};

module.exports = {
  getRandomMove,
};
