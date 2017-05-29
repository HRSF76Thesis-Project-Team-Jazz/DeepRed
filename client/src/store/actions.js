import * as types from './actionTypes';

/**
 * Action Creators:
 * Functions that create actions:
 * Actions = { type: TYPE, vars: VALS }
 */


export const invalidSelection = coordinates => ({
  type: types.INVALID_SELECTION,
  coordinates,
});

export const selectPiece = coordinates => ({
  type: types.SELECT_PIECE,
  coordinates,
});

export const capturePiece = coordinates => ({
  type: types.CAPTURE_PIECE,
  coordinates,
});

export const requestMove = coordinates => ({
  type: types.REQUEST_MOVE,
  coordinates,
});

export const receiveMove = (query, move) => ({
  type: types.RECEIVE_MOVE,
  query,
  move,
  receivedAt: Date.now(),
});
