/**
  reducers hold the store's state (the initialState object defines it)
  reducers also handle plain object actions and modify their state (immutably) accordingly
  this is the only way to change the store's state
  the other exports in this file are selectors, which is business logic
  that digests parts of the store's state
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
  capturedPiecesBlack: [],
  capturedPiecesWhite: [],
  gameTurn: 'W',
  moveHistory: [],
}), action) => {
  switch (action.type) {
    case types.MOVE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.fromPosition[1]] + (8 - action.fromPosition[0]);
      const to = cols[action.coordinates[1]] + (8 - action.coordinates[0]);
      return Immutable({
        ...state,
        moveHistory: state.moveHistory.concat({ from, to }),
      });
    }
    case types.CAPTURE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.fromPosition[1]] + (8 - action.fromPosition[0]);
      const to = cols[action.coordinates[1]] + (8 - action.coordinates[0]);
      const capturedPiece = action.capturedPiece;
      const capturedPiecesArray = (capturedPiece[0] === 'W') ? 'capturedPiecesBlack' : 'capturedPiecesWhite';
      const newState = {
        ...state,
        moveHistory: state.moveHistory.concat({ from, to, capturedPiece }),
        capturedPiecesArray: state[capturedPiecesArray].concat(capturedPiece),
      };
      newState[capturedPiecesArray] = state[capturedPiecesArray].concat(capturedPiece);
      return Immutable(newState);
    }
    default:
      return state;
  }
};

const boardState = (state = {
  board: [
    ['BR', 'BN', 'BB', 'BQ', 'BK', 'BB', 'BN', 'BR'],
    ['BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP', 'BP'],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    ['WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP', 'WP'],
    ['WR', 'WN', 'WB', 'WQ', 'WK', 'WB', 'WN', 'WR'],
  ],
}, action) => {
  switch (action.type) {
    case types.MOVE_PIECE: {
      const board = state.board.slice(0);
      board[action.fromPosition[0]][action.fromPosition[1]] = null;
      board[action.coordinates[0]][action.coordinates[1]] = action.selectedPiece;
      return { ...state, board };
    }
    case types.CAPTURE_PIECE: {
      const board = state.board.slice(0);
      board[action.fromPosition[0]][action.fromPosition[1]] = null;
      board[action.coordinates[0]][action.coordinates[1]] = action.selectedPiece;
      return { board };
    }
    case types.RECEIVE_GAME: {
      return Immutable({
        ...state,
        board: action.game.board,
      });
    }
    default:
      return state;
  }
};

const moveState = (state = Immutable({
  message: ' reducer: moveState message ',
  fromPosition: '',
  selectedPiece: '',
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
        fromPosition: action.coordinates,
        selectedPiece: action.selectedPiece,
        message: `Selected: ${action.coordinates}`,
      });
    case types.UNSELECT_PIECE:
      return Immutable({
        ...state,
        fromPosition: '',
        selectedPiece: '',
        message: 'Selected: N/A',
      });
    case types.MOVE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.fromPosition[1]] + (8 - action.fromPosition[0]);
      const to = cols[action.coordinates[1]] + (8 - action.coordinates[0]);
      // const from = '';
      // const to = '';
      return Immutable({
        ...state,
        fromPosition: '',
        selectedPiece: '',
        message: `Move: ${from}-${to}`,
      });
    }
    case types.CAPTURE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.fromPosition[1]] + (8 - action.fromPosition[0]);
      const to = cols[action.coordinates[1]] + (8 - action.coordinates[0]);
      return Immutable({
        ...state,
        fromPosition: '',
        selectedPiece: '',
        message: `Move: ${from}x${to}`,
      });
    }
    default:
      return state;
  }
};

const userState = (state = Immutable({
  message: '',
  playerB: '',
  playerW: '',
  room: '',
}), action) => {
  switch (action.type) {
    case types.SET_PLAYER_W: {
      return Immutable({
        ...state,
        playerW: action.player.data.display,
      });
    }
    case types.SET_PLAYER_B: {
      return Immutable({
        ...state,
        playerB: action.player.data.display,
      })
    }
    case types.GET_REQUEST_FAILURE: {
      return Immutable({
        ...state,
        message: action.message,
      });
    }
    case types.UPDATE_ROOM_INFO: {
      return Immutable({
        ...state,
        room: action.roomInfo[0],
      })
    }
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  gameState,
  boardState,
  moveState,
  userState,
});

export default rootReducer;
