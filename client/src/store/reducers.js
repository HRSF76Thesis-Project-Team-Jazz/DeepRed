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
  minW: 10,
  minB: 10,
  secW: 0,
  secB: 0,
  milisecW: 0,
  milisecB: 0,
  capturedPiecesBlack: [],
  capturedPiecesWhite: [],
  gameTurn: 'W',
  moveHistory: [],
  messagesLocal: [],
  messagesGlobal: [],
  counterBinstance: '',
  counterWinstance: '',
  playerInCheck: null,
  winner: null,
  showCheckDialog: false,
  showWinnerDialog: false,
  gameMode: 'default',
}), action) => {
  switch (action.type) {
    case types.RECEIVE_GAME: {
      return Immutable({
        ...state,
        capturedPiecesBlack: action.game.blackCapPieces,
        capturedPiecesWhite: action.game.whiteCapPieces,
        gameTurn: action.game.turn,
        playerInCheck: action.game.playerInCheck,
        winner: action.game.winner,
      });
    }
    case types.MOVE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        moveHistory: state.moveHistory.concat({ from, to }),
        gameTurn: action.gameTurn,
      });
    }
    case types.CASTLING_MOVE: {
      let castleNotation = 'O-O';
      if (action.castling[2] === 'Q') {
        castleNotation = 'O-O-O';
      }
      return Immutable({
        ...state,
        moveHistory: state.moveHistory.concat({ castleNotation }),
        gameTurn: action.gameTurn,
      });
    }
    case types.EN_PASSANT_MOVE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        moveHistory: state.moveHistory.concat({ from, to }),
        gameTurn: action.gameTurn,
      });
    }
    case types.PAWN_PROMOTION_MOVE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        moveHistory: state.moveHistory.concat({ from, to }),
        gameTurn: action.gameTurn,
      });
    }
    case types.CAPTURE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
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
        minB: Math.floor(state.timeB / 60),
        secB: state.timeB % 60,
      });
    }
    case types.UPDATE_TIMER_W: {
      return Immutable({
        ...state,
        timeW: action.timeW,
        minW: Math.floor(state.timeW / 60),
        secW: state.timeW % 60,
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
    case types.SEND_MESSAGE_LOCAL: {
      return Immutable({
        ...state,
        messagesLocal: state.messagesLocal.concat(action.msg),
      });
    }
    case types.SEND_MESSAGE_GLOBAL: {
      return Immutable({
        ...state,
        messagesGlobal: state.messagesGlobal.concat(action.msg),
      });
    }
    case types.OPEN_CHECK_DIALOG: {
      return Immutable({
        ...state,
        showCheckDialog: true,
        playerInCheck: action.playerInCheck,
      });
    }
    case types.CLOSE_CHECK_DIALOG: {
      return Immutable({
        ...state,
        showCheckDialog: false,
      });
    }
    case types.OPEN_WINNER_DIALOG: {
      return Immutable({
        ...state,
        showWinnerDialog: true,
        winner: action.winner,
      });
    }
    case types.CLOSE_WINNER_DIALOG: {
      return Immutable({
        ...state,
        showWinnerDialog: false,
        winner: null,
      });
    }
    case types.UPDATE_GAME_MODE: {
      return Immutable({
        ...state,
        gameMode: action.mode,
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
    // case types.MOVE_PIECE: {
    //   const board = state.board.slice(0);
    //   board[action.dest[0]][action.dest[1]]
    //     = board[action.origin[0]][action.origin[1]];
    //   board[action.origin[0]][action.origin[1]] = null;
    //   return { board };
    // }
    // case types.CAPTURE_PIECE: {
    //   const board = state.board.slice(0);
    //   board[action.dest[0]][action.dest[1]]
    //     = board[action.origin[0]][action.origin[1]];
    //   board[action.origin[0]][action.origin[1]] = null;
    //   return { board };
    // }
    // case types.CASTLING_MOVE: {
    //   const board = state.board.slice(0);
    //   board[action.dest[0]][action.dest[1]]
    //     = board[action.origin[0]][action.origin[1]];
    //   board[action.origin[0]][action.origin[1]] = null;
    //   if (action.castling === 'BRQ') {
    //     board[0][3] = 'BR';
    //     board[0][0] = null;
    //   } else if (action.castling === 'BRK') {
    //     board[0][5] = 'BR';
    //     board[0][7] = null;
    //   } else if (action.castling === 'WRQ') {
    //     board[7][3] = 'WR';
    //     board[7][0] = null;
    //   } else if (action.castling === 'WRK') {
    //     board[7][5] = 'WR';
    //     board[7][7] = null;
    //   }
    //   return { board };
    // }
    // case types.EN_PASSANT_MOVE: {
    //   const board = state.board.slice(0);
    //   board[action.dest[0]][action.dest[1]]
    //     = board[action.origin[0]][action.origin[1]];
    //   board[action.origin[0]][action.origin[1]] = null;
    //   board[action.enPassantCoord[0]][action.enPassantCoord[1]] = null;
    //   return { board };
    // }
    // case types.PAWN_PROMOTION_MOVE: {
    //   const board = state.board.slice(0);
    //   board[action.dest[0]][action.dest[1]]
    //     = action.pawnPromotionPiece;
    //   board[action.origin[0]][action.origin[1]] = null;
    //   return { board };
    // }
    case types.RECEIVE_GAME: {
      return { board: action.game.board };
    }
    default:
      return state;
  }
};

const moveState = (state = Immutable({
  message: 'New Game',
  origin: '',
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
  pawnPromotion: null,
  pawnPromotionCoord: [],
  showPromotionDialog: false,
}), action) => {
  switch (action.type) {
    case types.OPEN_PROMOTION_DIALOG:
      return Immutable({
        ...state,
        pawnPromotionCoord: action.dest,
        showPromotionDialog: true,
      });
    case types.CLOSE_PROMOTION_DIALOG:
      return Immutable({
        ...state,
        pawnPromotionCoord: [],
        showPromotionDialog: false,
      });
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
        message: `Invalid selection [${action.dest}] - select again`,
      });
    case types.SELECT_PIECE:
      return Immutable({
        ...state,
        origin: action.dest,
        selectedPiece: action.selectedPiece,
        message: `Selected: ${action.dest}`,
      });
    case types.UNSELECT_PIECE:
      return Immutable({
        ...state,
        origin: '',
        selectedPiece: '',
        message: '',
      });
    case types.MOVE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        origin: '',
        selectedPiece: '',
        message: `Move: ${from}-${to}`,
        error: '',
      });
    }
    case types.CASTLING_MOVE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        origin: '',
        selectedPiece: '',
        message: `Castling: ${from}-${to} - ${action.castling}`,
        error: '',
      });
    }
    case types.EN_PASSANT_MOVE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        origin: '',
        selectedPiece: '',
        message: `En Passant: ${from}-${to} - ${action.castling}`,
        error: '',
      });
    }
    case types.CAPTURE_PIECE: {
      const cols = 'abcdefgh';
      const from = cols[action.origin[1]] + (8 - action.origin[0]);
      const to = cols[action.dest[1]] + (8 - action.dest[0]);
      return Immutable({
        ...state,
        origin: '',
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
  allRooms: [],
  roomQueue: [],
  count: 0,
  gameResult: {},
}), action) => {
  switch (action.type) {
    case types.SET_PLAYER: {
      return Immutable({
        ...state,
        // playerW: action.player.data.display,
        // playerWemail: action.player.data.email,
        thisUser: action.player.data.display,
        thisEmail: action.player.data.email,
      });
    }
    case types.SET_PLAYER_ID: {
      return Immutable({
        ...state,
        thisUserId: action.id,
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
        count: action.roomInfo.count,
        room: action.roomInfo.room,
        playerB: action.roomInfo.playerB,
        playerW: action.roomInfo.playerW,
        playerBid: action.roomInfo.playerBid,
        playerWid: action.roomInfo.playerWid,
        playerBemail: action.roomInfo.playerBemail,
        playerWemail: action.roomInfo.playerWemail,
        thisUserId: (state.thisUserId === '') ? action.roomInfo.thisUserId : state.thisUserId,
        isWhite: (state.thisUser !== action.roomInfo.playerB),
      });
    }
    // isWhite: (!action.roomInfo.playerB) ? true : state.thisUserId !== '',
    case types.UPDATE_ALL_ROOMS: {
      return Immutable({
        ...state,
        allRooms: action.allRooms,
      });
    }
    case types.UPDATE_ROOM_QUEUE: {
      return Immutable({
        ...state,
        roomQueue: action.queue,
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
  cancelResumeOpen: false,
  pauseOpen: false,
  resumeOpen: false,
  surrenderOpen: false,
  chooseGameModeOpen: false,
  chooseRoomOpen: false,
  chooseSideOpen: false,
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
    case types.RESUME_DIALOG_OPEN: {
      return Immutable({
        ...state,
        resumeOpen: true,
      });
    }
    case types.RESUME_DIALOG_CLOSE: {
      return Immutable({
        ...state,
        resumeOpen: false,
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
    case types.CANCEL_RESUME_DIALOG_OPEN: {
      return Immutable({
        ...state,
        cancelResumeOpen: true,
      });
    }
    case types.CANCEL_RESUME_DIALOG_CLOSE: {
      return Immutable({
        ...state,
        cancelResumeOpen: false,
      });
    }
    case types.UPDATE_ALERT_NAME: {
      return Immutable({
        ...state,
        alertName: action.alertName,
      });
    }
    case types.ANNOUNCE_SURRENDER_DIALOG_OPEN: {
      return Immutable({
        ...state,
        surrenderOpen: true,
      });
    }
    case types.ANNOUNCE_SURRENDER_DIALOG_CLOSE: {
      return Immutable({
        ...state,
        surrenderOpen: false,
      });
    }
    case types.SELECT_GAME_MODE_OPEN: {
      return Immutable({
        ...state,
        chooseGameModeOpen: true,
      });
    }
    case types.SELECT_GAME_MODE_CLOSE: {
      return Immutable({
        ...state,
        chooseGameModeOpen: false,
      });
    }
    case types.SELECT_ROOM_OPEN: {
      return Immutable({
        ...state,
        chooseRoomOpen: true,
      });
    }
    case types.SELECT_ROOM_CLOSE: {
      return Immutable({
        ...state,
        chooseRoomOpen: false,
      });
    }
    case types.SELECT_SIDE_OPEN: {
      return Immutable({
        ...state,
        chooseSideOpen: true,
      });
    }
    case types.SELECT_SIDE_CLOSE: {
      return Immutable({
        ...state,
        chooseSideOpen: false,
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
