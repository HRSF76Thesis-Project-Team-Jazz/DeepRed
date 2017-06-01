import axios from 'axios';
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

export const setPlayerW = player => ({
  type: types.SET_PLAYER_W,
  player,
});

export const setPlayerB = player => ({
  type: types.SET_PLAYER_B,
  player,
})

export const getRequestFailure = message => ({
  type: types.GET_REQUEST_FAILURE,
  message,
});

export const updateRoomInfo = roomInfo => ({
  type: types.UPDATE_ROOM_INFO,
  roomInfo,
})
// TO BE IMPLEMENTED

export const receiveMove = (query, move) => ({
  type: types.RECEIVE_MOVE,
  query,
  move,
  receivedAt: Date.now(),
});

