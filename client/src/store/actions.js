import * as types from './actionTypes';

/**
 * Action Creators:
 * Functions that create actions:
 * Actions = { type: TYPE, vars: VALS }
 */
export const displayError = error => ({
  type: types.DISPLAY_ERROR,
  error,
});
export const clearError = () => ({
  type: types.CLEAR_ERROR,
});

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

export const colorSquare = (color, hover) => ({
  type: types.COLOR_SQUARE,
  color,
  hover,
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

// userState actions
export const setPlayerW = player => ({
  type: types.SET_PLAYER_W,
  player,
});

export const setPlayerB = player => ({
  type: types.SET_PLAYER_B,
  player,
});

export const getRequestFailure = message => ({
  type: types.GET_REQUEST_FAILURE,
  message,
});

export const updateRoomInfo = roomInfo => ({
  type: types.UPDATE_ROOM_INFO,
  roomInfo,
});

// controlState actions
export const pauseTimerB = pausedB => ({
  type: types.PAUSE_TIMER_B,
  pausedB,
});

export const pauseTimerW = pausedW => ({
  type: types.PAUSE_TIMER_W,
  pausedW,
});

export const pauseDialogOpen = () => ({
  type: types.PAUSE_DIALOG_OPEN,
});

export const pauseDialogClose = () => ({
  type: types.PAUSE_DIALOG_CLOSE,
});

// other requests
export const fetchGame = () => (dispatch) => {
  dispatch(requestGame());
  return fetch('http://127.0.0.1:3000/api/game')
    .then(response => response.json())
    .then(json =>
      dispatch(receiveGame(json)),
    );
};

export const sendMsg = msg => ({
  type: types.SEND_MESSAGE,
  msg,
})