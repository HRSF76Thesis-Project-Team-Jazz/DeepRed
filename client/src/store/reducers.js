// reducers hold the store's state (the initialState object defines it)
// reducers also handle plain object actions and modify their state (immutably) accordingly
// this is the only way to change the store's state
// the other exports in this file are selectors, which is business logic that digests parts of the store's state
// for easier consumption by views

import { combineReducers } from 'redux';
import Immutable from 'seamless-immutable';
import * as types from './actionTypes';

const gameState = (state = Immutable({
  gameId: '',
  clock_W: '',
  clock_B: '',
  player_W: '',
  player_B: '',
  capturedPiecesBlack: ['WP', 'WP', 'WN'],
  capturedPiecesWhite: ['BP', 'BP', 'BQ'],
  gameTurn: 'W',
  moveHistory: [
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
    { from: 'e2', to: 'e4' },
  ],
}), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const boardState = (state = Immutable({
  board: [['BR', 'BN', 'BB', 'BK', 'BQ', 'BB', 'BN', 'BR'],
  ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
  ['WR', 'WN', 'WB', 'WK', 'WQ', 'WB', 'WN', 'WR']],
}), action) => {
  switch (action.type) {
    default:
      return state;
  }
};

const moveState = (state = Immutable({
  message: '  ',
  selectedPosition: '',
  selectedPiece: '',
  originDestCoord: '',
  moveHistory: [],
}), action) => {
  switch (action.type) {
    case types.REQUEST_MOVE:
      return {
        ...state,
        selectedPosition: action.coordinates,
      };
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
