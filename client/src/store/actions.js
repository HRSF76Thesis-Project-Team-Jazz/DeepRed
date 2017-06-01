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

export const selectPiece = (selectedPiece, coordinates) => ({
  type: types.SELECT_PIECE,
  selectedPiece,
  coordinates,
});

export const unselectPiece = () => ({
  type: types.UNSELECT_PIECE,
});

export const movePiece = (selectedPiece, fromPosition, coordinates) => ({
  type: types.MOVE_PIECE,
  selectedPiece,
  fromPosition,
  coordinates,
});

export const capturePiece = (selectedPiece, fromPosition, coordinates, capturedPiece) => ({
  type: types.CAPTURE_PIECE,
  selectedPiece,
  fromPosition,
  coordinates,
  capturedPiece,
});

export const getRequestSuccess = player => ({
  type: types.GET_REQUEST_SUCCESS,
  player,
});

export const getRequestFailure = message => ({
  type: types.GET_REQUEST_FAILURE,
  message,
});
// TO BE IMPLEMENTED

export const receiveMove = (query, move) => ({
  type: types.RECEIVE_MOVE,
  query,
  move,
  receivedAt: Date.now(),
});

export const requestGame = () => ({
  type: types.REQUEST_GAME,
});

export const receiveGame = game => ({
  type: types.RECEIVE_GAME,
  game,
});

export const fetchGame = () => (dispatch) => {
  dispatch(requestGame());
  return fetch('http://127.0.0.1:3000/api/game')
    .then(response => response.json())
    .then(json =>
      dispatch(receiveGame(json)),
    );
};
