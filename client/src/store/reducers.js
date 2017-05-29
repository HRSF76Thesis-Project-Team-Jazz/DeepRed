/**
  reducers hold the store's state (the initialState object defines it)
  reducers also handle plain object actions and modify their state (immutably) accordingly
  this is the only way to change the store's state
  the other exports in this file are selectors, which is business logic that digests parts of the store's state
  for easier consumption by views

  Reducers take state and action as arguments
  and returns the next state
 */

import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const gameState = (state = Immutable({
  playerColor: 'W',
  gameId: '',
  clock_W: '',
  clock_B: '',
  player_W: '',
  player_B: '',
  capturedPiecesBlack: ['Reducer', 'WP', 'WP', 'WN'],
  capturedPiecesWhite: ['Reducer', 'BP', 'BP', 'BQ'],
  gameTurn: 'W',
  moveHistory: [
    { from: 'red', to: 'ucer' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
    { from: 'e2', to: 'e4' },
  ],
}), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const boardState = (state = Immutable({
  board: [['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR']],
}), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const moveState = (state = Immutable({
  message: ' reducer: moveState message ',
  selectedPosition: '',
  selectedPiece: '',
  originDestCoord: '',
  moveHistory: [],
}), action) => {
  switch (action.type) {
    case types.INVALID_SELECTION:
      return Immutable({
        ...state,
        message: `Invalid selection [${action.coordinates}] - select again`,
      });
    case types.SELECT_PIECE:
      return Immutable({
        ...state,
        selectedPosition: action.coordinates,
        message: `Selected: ${action.coordinates}`,
      });
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  gameState,
  boardState,
  moveState,
});

export default rootReducer;
