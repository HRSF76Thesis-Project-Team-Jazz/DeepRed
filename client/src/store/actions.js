import * as types from './actionTypes';

/**
 * Action Creators:
 * Functions that create actions:
 * Actions = { type: TYPE, vars: VALS }
 */
// gameState actions
export const updateGameMode = mode => ({
  type: types.UPDATE_GAME_MODE,
  mode,
});

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

export const invalidSelection = dest => ({
  type: types.INVALID_SELECTION,
  dest,
});

export const selectPiece = (selectedPiece, dest) => ({
  type: types.SELECT_PIECE,
  selectedPiece,
  dest,
});

export const saveBoolBoard = boolBoard => ({
  type: types.SAVE_BOOL_BOARD,
  boolBoard,
});

export const resetBoolBoard = () => ({
  type: types.RESET_BOOL_BOARD,
});

export const hideAIButton = () => ({
  type: types.HIDE_AI_BUTTON,
});

export const showAIButton = () => ({
  type: types.SHOW_AI_BUTTON,
});

export const updateGameSummary = gameSummary => ({
  type: types.UPDATE_GAME_SUMMARY,
  games: gameSummary.games,
  whiteWins: gameSummary.whiteWins,
  blackWins: gameSummary.blackWins,
  stalemateByMoves: gameSummary.stalemateByMoves,
  stalemateByPieces: gameSummary.stalemateByPieces,
  stalemateNoWhiteMoves: gameSummary.stalemateNoWhiteMoves,
  stalemateNoBlackMoves: gameSummary.stalemateNoBlackMoves,
  end100moves: gameSummary.end100moves,
  castleKing: gameSummary.castleKing,
  castleQueen: gameSummary.castleQueen,
  pawnPromotion: gameSummary.pawnPromotion,
  enPassant: gameSummary.enPassant,
  averageMovesPerGame: gameSummary.averageMovesPerGame,
});

export const unselectPiece = () => ({
  type: types.UNSELECT_PIECE,
});

export const colorSquare = (color, hover) => ({
  type: types.COLOR_SQUARE,
  color,
  hover,
});

// export const movePiece = (fromPosition, dest, gameTurn) => ({
//   type: types.MOVE_PIECE,
//   fromPosition,
//   dest,
//   gameTurn,
// });
//
// export const capturePiece = (fromPosition, dest, capturedPiece, gameTurn) => ({
//   type: types.CAPTURE_PIECE,
//   fromPosition,
//   dest,
//   capturedPiece,
//   gameTurn,
// });
//
// export const castlingMove = (fromPosition, dest, castling, gameTurn) => ({
//   type: types.CASTLING_MOVE,
//   fromPosition,
//   dest,
//   castling,
//   gameTurn,
// });
//
// export const enPassantMove = (fromPosition, dest, enPassantCoord, gameTurn) => ({
//   type: types.EN_PASSANT_MOVE,
//   fromPosition,
//   dest,
//   enPassantCoord,
//   gameTurn,
// });
//
// export const pawnPromotionMove = (fromPosition, dest, pawnPromotionPiece, gameTurn) => ({
//   type: types.PAWN_PROMOTION_MOVE,
//   fromPosition,
//   dest,
//   pawnPromotionPiece,
//   gameTurn,
// });

export const openPromotionDialog = dest => ({
  type: types.OPEN_PROMOTION_DIALOG,
  dest,
});

export const closePromotionDialog = dest => ({
  type: types.CLOSE_PROMOTION_DIALOG,
  dest,
});

export const openCheckDialog = playerInCheck => ({
  type: types.OPEN_CHECK_DIALOG,
  playerInCheck,
});

export const closeCheckDialog = () => ({
  type: types.CLOSE_CHECK_DIALOG,
});

export const openWinnerDialog = winner => ({
  type: types.OPEN_WINNER_DIALOG,
  winner,
});

export const closeWinnerDialog = () => ({
  type: types.CLOSE_WINNER_DIALOG,
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

export const updateBoard = board => ({
  type: types.UPDATE_BOARD,
  board,
});

export const resetBoard = () => ({
  type: types.RESET_BOARD,
});

export const updateCapturedPieces = (blackCapPieces, whiteCapPieces) => ({
  type: types.UPDATE_CAPTURED_PIECES,
  blackCapPieces,
  whiteCapPieces,
});

export const clearCapturedPieces = () => ({
  type: types.CLEAR_CAPTURED_PIECES,
});

// userState actions
export const setPlayer = player => ({
  type: types.SET_PLAYER,
  player,
});

export const setPlayerId = id => ({
  type: types.SET_PLAYER_ID,
  id,
});

export const getRequestFailure = message => ({
  type: types.GET_REQUEST_FAILURE,
  message,
});

export const updateRoomInfo = roomInfo => ({
  type: types.UPDATE_ROOM_INFO,
  roomInfo,
});

export const updateAllRooms = allRooms => ({
  type: types.UPDATE_ALL_ROOMS,
  allRooms,
});

export const updateRoomQueue = queue => ({
  type: types.UPDATE_ROOM_QUEUE,
  queue,
});

export const gameWinLose = (winner, loser) => ({
  type: types.GAME_WIN_LOSE,
  winner,
  loser,
});

export const gameDraw = (player1, player2) => ({
  type: types.GAME_DRAW,
  player1,
  player2,
});

// controlState actions
export const pauseDialogOpen = () => ({
  type: types.PAUSE_DIALOG_OPEN,
});

export const pauseDialogClose = () => ({
  type: types.PAUSE_DIALOG_CLOSE,
});

export const resumeDialogOpen = () => ({
  type: types.RESUME_DIALOG_OPEN,
});

export const resumeDialogClose = () => ({
  type: types.RESUME_DIALOG_CLOSE,
});

export const cancelPauseDialogOpen = () => ({
  type: types.CANCEL_PAUSE_DIALOG_OPEN,
});

export const cancelPauseDialogClose = () => ({
  type: types.CANCEL_PAUSE_DIALOG_CLOSE,
});

export const cancelResumeDialogOpen = () => ({
  type: types.CANCEL_RESUME_DIALOG_OPEN,
});

export const cancelResumeDialogClose = () => ({
  type: types.CANCEL_RESUME_DIALOG_CLOSE,
});

export const updateAlertName = alertName => ({
  type: types.UPDATE_ALERT_NAME,
  alertName,
});

export const announceSurrenderDialogOpen = () => ({
  type: types.ANNOUNCE_SURRENDER_DIALOG_OPEN,
});

export const announceSurrenderDialogClose = () => ({
  type: types.ANNOUNCE_SURRENDER_DIALOG_CLOSE,
});

export const confirmSurrenderDialogOpen = () => ({
  type: types.CONFIRM_SURRENDER_DIALOG_OPEN,
});

export const confirmSurrenderDialogClose = () => ({
  type: types.CONFIRM_SURRENDER_DIALOG_CLOSE,
});

export const selectGameModeOpen = () => ({
  type: types.SELECT_GAME_MODE_OPEN,
});

export const selectGameModeClose = () => ({
  type: types.SELECT_GAME_MODE_CLOSE,
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

export const turnClockOn = () => ({
  type: types.TURN_CLOCK_ON,
});

export const turnClockOff = () => ({
  type: types.TURN_CLOCK_OFF,
});

export const toggleSystemPause = () => ({
  type: types.TOGGLE_SYSTEM_PAUSE,
});

export const toggleSystemResume = () => ({
  type: types.TOGGLE_SYSTEM_RESUME,
});

export const turnSnackbarOn = () => ({
  type: types.TURN_SNACKBAR_ON,
});

export const turnSnackbarOff = () => ({
  type: types.TURN_SNACKBAR_OFF,
});

export const timeoutDialogOpen = () => ({
  type: types.TIMEOUT_DIALOG_OPEN,
});

export const timeoutDialogClose = () => ({
  type: types.TIMEOUT_DIALOG_CLOSE,
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

export const sendMsgLocal = msg => ({
  type: types.SEND_MESSAGE_LOCAL,
  msg,
});

export const sendMsgGlobal = msg => ({
  type: types.SEND_MESSAGE_GLOBAL,
  msg,
});
