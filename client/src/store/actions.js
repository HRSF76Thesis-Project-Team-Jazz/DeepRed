import * as types from './actionTypes';

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
