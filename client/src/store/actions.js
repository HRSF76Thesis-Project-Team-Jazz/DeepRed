import * as types from './actionTypes';

/**
 * Action Creators:
 * Functions that create actions:
 * Actions = { type: TYPE, vars: VALS }
 */
// gameState actions
export const updateTimer = roomInfo => ({
  type: types.UPDATE_TIMER,
  roomInfo,
});

export const updateTimerB = timeB => ({
  type: types.UPDATE_TIMER_B,
  timeB,
});

export const updateTimerW = timeW => ({
  type: types.UPDATE_TIMER_W,
  timeW,
});

export const timeInstanceB = ref => ({
  type: types.TIME_INSTANCE_B,
  ref,
});

export const timeInstanceW = ref => ({
  type: types.TIME_INSTANCE_W,
  ref,
});

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

export const saveBoolBoard = boolBoard => ({
  type: types.SAVE_BOOL_BOARD,
  boolBoard,
});

export const resetBoolBoard = () => ({
  type: types.RESET_BOOL_BOARD,
});

export const unselectPiece = () => ({
  type: types.UNSELECT_PIECE,
});

export const colorSquare = (color, hover) => ({
  type: types.COLOR_SQUARE,
  color,
  hover,
});

export const movePiece = (fromPosition, coordinates, gameTurn) => ({
  type: types.MOVE_PIECE,
  fromPosition,
  coordinates,
  gameTurn,
});

export const capturePiece = (fromPosition, coordinates, capturedPiece, gameTurn) => ({
  type: types.CAPTURE_PIECE,
  fromPosition,
  coordinates,
  capturedPiece,
  gameTurn,
});

export const castlingMove = (fromPosition, coordinates, castling, gameTurn) => ({
  type: types.CASTLING_MOVE,
  fromPosition,
  coordinates,
  castling,
  gameTurn,
});

export const enPassantMove = (fromPosition, coordinates, enPassantCoord, gameTurn) => ({
  type: types.EN_PASSANT_MOVE,
  fromPosition,
  coordinates,
  enPassantCoord,
  gameTurn,
});

export const pawnPromotionMove = (fromPosition, coordinates, pawnPromotionPiece, gameTurn) => ({
  type: types.PAWN_PROMOTION_MOVE,
  fromPosition,
  coordinates,
  pawnPromotionPiece,
  gameTurn,
});

export const openPromotionDialog = coordinates => ({
  type: types.OPEN_PROMOTION_DIALOG,
  coordinates,
});

export const closePromotionDialog = coordinates => ({
  type: types.CLOSE_PROMOTION_DIALOG,
  coordinates,
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

export const getRequestFailure = message => ({
  type: types.GET_REQUEST_FAILURE,
  message,
});

export const updateRoomInfo = roomInfo => ({
  type: types.UPDATE_ROOM_INFO,
  roomInfo,
});

// controlState actions
export const pauseDialogOpen = () => ({
  type: types.PAUSE_DIALOG_OPEN,
});

export const pauseDialogClose = () => ({
  type: types.PAUSE_DIALOG_CLOSE,
});

export const cancelPauseDialogOpen = () => ({
  type: types.CANCEL_PAUSE_DIALOG_OPEN,
});

export const cancelPauseDialogClose = () => ({
  type: types.CANCEL_PAUSE_DIALOG_CLOSE,
});

export const updateAlertName = alertName => ({
  type: types.UPDATE_ALERT_NAME,
  alertName,
});

export const chooseGameModeOpen = () => ({
  type: types.CHOOSE_GAME_MODE_OPEN,
});

export const chooseGameModeClose = () => ({
  type: types.CHOOSE_GAME_MODE_CLOSE,
});

export const selectRoomOpen = () => ({
  type: types.SELECT_ROOM_OPEN,
});

export const selectRoomClose = () => ({
  type: types.SELECT_ROOM_CLOSE,
});

export const selectSideOpen = () => ({
  type: types.SELECT_SIDE_OPEN,
});

export const selectSideClose = () => ({
  type: types.SELECT_SIDE_CLOSE,
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
});
