import * as types from './actionTypes';

/**
 * Action Creators:
 * Functions that create actions:
 * Actions = { type: TYPE, vars: VALS }
 */


export const selectSquare = coordinates => ({
  type: types.SELECT_SQUARE,
  coordinates,
  receivedAt: Date.now(),
});

export const requestMove = coordinates => ({
  type: types.REQUEST_MOVE,
  coordinates,
  receivedAt: Date.now(),
});

export const receiveMove = (query, move) => ({
  type: types.RECEIVE_MOVE,
  query,
  move,
  receivedAt: Date.now(),
});
