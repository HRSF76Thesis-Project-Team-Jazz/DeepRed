import * as types from './actionTypes';

export const requestMove = query => ({
  type: types.REQUEST_MOVE,
  query,
});

export const receiveMove = (query, move) => ({
  type: types.RECEIVE_MOVE,
  query,
  move,
  receivedAt: Date.now(),
});
