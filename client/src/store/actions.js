export const REQUEST_MOVE = 'REQUEST_MOVE';
export const RECEIVE_MOVE = 'RECEIVE_MOVE';

export const requestMove = query => ({
  type: REQUEST_MOVE,
  query,
});

export const receiveMove = (query, move) => ({
  type: RECEIVE_MOVE,
  query,
  move,
  receivedAt: Date.now(),
});


/**
 * Example action
 * Needs re config for production
 */

const sendMove = query => (dispatch) => {
  dispatch(requestMove(query));
  return fetch('http//localhost:3000', query)
  .then(response => response.json())
  .then(move => dispatch(receiveMove(query, move)));
};
