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
  timeW: 600,
  timeB: 600,
  capturedPiecesBlack: [],
  capturedPiecesWhite: [],
  gameTurn: 'W',
  moveHistory: [],
  messages: [],
  counterBinstance: '',
  counterWinstance: '',
}), action) => {
  switch (action.type) {
    case types.MOVE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.fromPosition[1]] + (8 - action.fromPosition[0]);
      const to = cols[action.coordinates[1]] + (8 - action.coordinates[0]);
      return Immutable({
        ...state,
        moveHistory: state.moveHistory.concat({ from, to }),
        gameTurn: action.gameTurn,
      });
    }
    case types.CASTLING_MOVE: {
      // fromPosition,
      // coordinates,
      // castling,
      // gameTurn,
      return Immutable({
        ...state,
        // moveHistory: state.moveHistory.concat({ from, to }),
        gameTurn: action.gameTurn,
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
        gameTurn: action.gameTurn,
      };
      newState[capturedPiecesArray] = state[capturedPiecesArray].concat(capturedPiece);
      return Immutable(newState);
    }
    case types.UPDATE_TIMER: {
      return Immutable({
        ...state,
        timeW: action.roomInfo.playerWtime,
        timeB: action.roomInfo.playerBtime,
      });
    }
    case types.UPDATE_TIMER_B: {
      return Immutable({
        ...state,
        timeB: action.timeB,
      });
    }
    case types.UPDATE_TIMER_W: {
      return Immutable({
        ...state,
        timeW: action.timeW,
      });
    }
    case types.TIME_INSTANCE_B: {
      return Immutable({
        ...state,
        counterBinstance: action.ref,
      });
    }
    case types.TIME_INSTANCE_W: {
      return Immutable({
        ...state,
        counterWinstance: action.ref,
      });
    }
    case types.SEND_MESSAGE: {
      return Immutable({
        ...state,
        messages: state.messages.concat(action.msg),
      });
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
      board[action.coordinates[0]][action.coordinates[1]]
        = board[action.fromPosition[0]][action.fromPosition[1]];
      board[action.fromPosition[0]][action.fromPosition[1]] = null;
      return { board };
    }
    case types.CAPTURE_PIECE: {
      const board = state.board.slice(0);
      board[action.coordinates[0]][action.coordinates[1]]
        = board[action.fromPosition[0]][action.fromPosition[1]];
      board[action.fromPosition[0]][action.fromPosition[1]] = null;
      return { board };
    }
    case types.CASTLING_MOVE: {
      const board = state.board.slice(0);
      board[action.coordinates[0]][action.coordinates[1]]
        = board[action.fromPosition[0]][action.fromPosition[1]];
      board[action.fromPosition[0]][action.fromPosition[1]] = null;
      if (action.castling === 'BRQ') {
        board[0][3] = 'BR';
        board[0][0] = null;
      } else if (action.castling === 'BRK') {
        board[0][5] = 'BR';
        board[0][7] = null;
      } else if (action.castling === 'WRQ') {
        board[7][3] = 'WR';
        board[7][0] = null;
      } else if (action.castling === 'WRK') {
        board[7][5] = 'WR';
        board[7][7] = null;
      }
      return { board };
    }
    case types.RECEIVE_GAME: {
      return { board: action.game.board };
    }
    default:
      return state;
  }
};

const moveState = (state = Immutable({
  message: 'New Game',
  fromPosition: '',
  selectedPiece: '',
  error: '',
  open: false,
  boolBoard: [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
  ],
}), action) => {
  switch (action.type) {
    case types.SAVE_BOOL_BOARD:
      return Immutable({
        ...state,
        boolBoard: action.boolBoard,
      });
    case types.RESET_BOOL_BOARD:
      return Immutable({
        ...state,
        boolBoard: [
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
          [null, null, null, null, null, null, null, null],
        ],
      });
    case types.DISPLAY_ERROR:
      return Immutable({
        ...state,
        message: action.error,
        error: action.error,
        open: true,
      });
    case types.CLEAR_ERROR:
      return Immutable({
        ...state,
        message: 'No Errors.',
        error: '',
        open: false,
      });
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
        message: '',
      });
    case types.MOVE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.fromPosition[1]] + (8 - action.fromPosition[0]);
      const to = cols[action.coordinates[1]] + (8 - action.coordinates[0]);
      return Immutable({
        ...state,
        fromPosition: '',
        selectedPiece: '',
        message: `Move: ${from}-${to}`,
        error: '',
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
  playerBid: '',
  playerWid: '',
  playerBemail: '',
  playerWemail: '',
  thisEmail: '',
  thisUser: '',
  thisUserId: '',
  isWhite: true,
}), action) => {
  switch (action.type) {
    case types.SET_PLAYER_W: {
      return Immutable({
        ...state,
        playerW: action.player.data.display,
        playerWemail: action.player.data.email,
        thisUser: action.player.data.display,
        thisEmail: action.player.data.email,
      });
    }
    case types.SET_PLAYER_B: {
      return Immutable({
        ...state,
        playerB: action.player.data.display,
      });
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
        room: action.roomInfo.room,
        playerB: action.roomInfo.playerB,
        playerW: action.roomInfo.playerW,
        playerBid: action.roomInfo.playerBid,
        playerWid: action.roomInfo.playerWid,
        playerBemail: action.roomInfo.playerBemail,
        playerWemail: action.roomInfo.playerWemail,
        thisUserId: (state.thisUserId === '') ? action.roomInfo.thisUserId : state.thisUserId,
        isWhite: (!action.roomInfo.playerB) ? true : state.thisUserId !== '',
      });
    }
    default:
      return state;
  }
};

const squareState = (state = Immutable({
  color: null,
  hover: [],
}), action) => {
  switch (action.type) {
    case types.COLOR_SQUARE: {
      return Immutable({
        ...state,
        color: action.color,
        hover: action.hover,
      });
    }
    default:
      return state;
  }
};

const controlState = (state = Immutable({
  alertName: '',
  cancelPauseOpen: false,
  pauseOpen: false,
}), action) => {
  switch (action.type) {
    case types.PAUSE_DIALOG_OPEN: {
      return Immutable({
        ...state,
        pauseOpen: true,
      });
    }
    case types.PAUSE_DIALOG_CLOSE: {
      return Immutable({
        ...state,
        pauseOpen: false,
      });
    }
    case types.CANCEL_PAUSE_DIALOG_OPEN: {
      return Immutable({
        ...state,
        cancelPauseOpen: true,
      });
    }
    case types.CANCEL_PAUSE_DIALOG_CLOSE: {
      return Immutable({
        ...state,
        cancelPauseOpen: false,
      });
    }
    case types.UPDATE_ALERT_NAME: {
      return Immutable({
        ...state,
        alertName: action.alertName,
      });
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
  squareState,
  controlState,
});

export default rootReducer;
