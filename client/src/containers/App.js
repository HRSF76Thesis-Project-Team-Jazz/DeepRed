import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import {
  updateTimer, cancelPauseDialogClose, updateAlertName,
  cancelPauseDialogOpen, pauseDialogOpen, pauseDialogClose, setPlayer,
  updateRoomInfo, getRequestFailure, receiveGame, movePiece, resetBoolBoard,
  unselectPiece, capturePiece, displayError, colorSquare, sendMsgLocal, sendMsgGlobal,
  updateTimerB, timeInstanceB, updateTimerW, timeInstanceW, saveBoolBoard, castlingMove,
  selectGameModeClose, selectRoomOpen, selectRoomClose,
  selectSideOpen, selectSideClose, updateAllRooms, setPlayerId,
  enPassantMove, pawnPromotionMove, resumeDialogOpen, resumeDialogClose, cancelResumeDialogOpen,
  cancelResumeDialogClose, announceSurrenderDialogOpen, announceSurrenderDialogClose,
  updateGameMode, openWinnerDialog, openCheckDialog, gameMode, turnClockOn, turnClockOff,
  toggleSystemPause, confirmSurrenderDialogClose, confirmSurrenderDialogOpen, turnSnackbarOn,
  timeoutDialogOpen, timeoutDialogClose,
} from '../store/actions';
// Components
import Header from '../components/Header';
import Board from './Board';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import Alert from './Alert';
import AlertRoom from './AlertRoom';
import PlayerName from '../components/PlayerName';
import Clock from '../components/Clock';
import Messages from '../components/Messages';
import SnackBar from '../components/SnackBar';
import './css/App.css';

// Needed for onTouchTap
// http://stackoverflow.com/a/34015469/988941
injectTapEventPlugin();
// CSS

class App extends Component {
  constructor(props) {
    super(props);
    this.getUserInfo = this.getUserInfo.bind(this);
    this.attemptMove = this.attemptMove.bind(this);
    this.checkLegalMoves = this.checkLegalMoves.bind(this);
    this.newChessGame = this.newChessGame.bind(this);
    this.startSocket = this.startSocket.bind(this);
    this.stopTimerB = this.stopTimerB.bind(this);
    this.stopTimerW = this.stopTimerW.bind(this);
    this.toggleTimers = this.toggleTimers.bind(this);
    this.decrementTimerB = this.decrementTimerB.bind(this);
    this.decrementTimerW = this.decrementTimerW.bind(this);
    this.closeDialog = this.closeDialog.bind(this);
    this.sendPauseRequest = this.sendPauseRequest.bind(this);
    this.sendResumeRequest = this.sendResumeRequest.bind(this);
    this.handlePauseOpen = this.handlePauseOpen.bind(this);
    this.handlePauseClose = this.handlePauseClose.bind(this);
    this.sendMessageLocal = this.sendMessageLocal.bind(this);
    this.sendMessageGlobal = this.sendMessageGlobal.bind(this);
    this.onCancelPauseRequest = this.onCancelPauseRequest.bind(this);
    this.handleCancelPauseClose = this.handleCancelPauseClose.bind(this);
    this.onAgreePauseRequest = this.onAgreePauseRequest.bind(this);
    this.onChangePlayerTurn = this.onChangePlayerTurn.bind(this);
    this.handleCreateRoomAsBlack = this.handleCreateRoomAsBlack.bind(this);
    this.handleCreateRoomAsWhite = this.handleCreateRoomAsWhite.bind(this);
    this.handleJoinRoomAsBlack = this.handleJoinRoomAsBlack.bind(this);
    this.handleJoinRoomAsWhite = this.handleJoinRoomAsWhite.bind(this);
    this.handleSurrender = this.handleSurrender.bind(this);
    this.handleResumeOpen = this.handleResumeOpen.bind(this);
    this.onCancelResumeRequest = this.onCancelResumeRequest.bind(this);
    this.onAgreeResumeRequest = this.onAgreeResumeRequest.bind(this);
    this.handleCancelResumeClose = this.handleCancelResumeClose.bind(this);
    this.handleAnnounceSurrenderOpen = this.handleAnnounceSurrenderOpen.bind(this);
    this.handleAnnounceSurrenderClose = this.handleAnnounceSurrenderClose.bind(this);
    this.updateUserGameStat = this.updateUserGameStat.bind(this);
    this.winLoseResult = this.winLoseResult.bind(this);
    this.conversation = this.conversation.bind(this);
    this.renderError = this.renderError.bind(this);
    this.handleConfirmSurrenderOpen = this.handleConfirmSurrenderOpen.bind(this);
    this.handleLobbyOpen = this.handleLobbyOpen.bind(this);
    this.goToLobby = this.goToLobby.bind(this);
    this.onTimeOut = this.onTimeOut.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  onChangePlayerTurn() {
    const { room, count, timeB, timeW } = this.props;
    this.stopTimerB();
    this.stopTimerW();
    this.socket.emit('updateTime', room, count, timeB, timeW);
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
      .then((response) => {
        console.log('successfully fetched current user infomation: ');
        dispatch(setPlayer(response));
      })
      .then(() => {
        dispatch(selectRoomOpen());
        this.startSocket();
      })

      .catch((err) => {
        dispatch(getRequestFailure(err));
        console.error('failed to obtain current user infomation!', err);
      });
  }

  conversation(message, context) {
    message = message || '';
    context = context || '';
    const payload = {
      intent: {
        intent: context,
      },
      input: {
        text: message,
      },
    };
    axios.post('/api/game/conversation', payload)
      .then((response) => {
        const { dispatch, messagesLocal, thisUser } = this.props;
        if (response.data.output.text[0]) {
          dispatch(sendMsgLocal({
            user: thisUser,
            color: 'red',
            message: response.data.output.text[0],
            timeStamp: JSON.stringify(new Date()),
          }));
        }
      })
      .catch((err) => {
        console.error('failed to send message to watson conversation service: ', err);
      });
  }

  renderError(error) {
    axios.post('/api/game/errorMessage', { input: error })
      .then((response) => {
        const { dispatch, messagesLocal, thisUser } = this.props;
        dispatch(sendMsgLocal({
          user: thisUser,
          color: 'red',
          message: response.data,
          timeStamp: JSON.stringify(new Date()),
        }));
      })
      .catch((err) => {
        console.error('failed to fetch error message ', err);
      });
  }

  updateUserGameStat(arr) {
    axios.post('/api/game/updateUserGameStat', arr)
      .then((response) => {
        // console.log('successfully sent user win lose information to server: ', response);
      })
      .catch((err) => {
        console.error('failed to send user win lose information to the server! ', err);
      });
  }

  startSocket() {
    const { dispatch, thisUser, thisEmail, playerB, playerW, gameMode, gameTurn } = this.props;
    const name = thisUser;
    const email = thisEmail;
    // instantiate socket instance on the client side
    this.socket = io.connect();

    this.socket.on('connect', () => {
      console.log('client side socket connected!');
      dispatch(setPlayerId(this.socket.id));
      this.socket.emit('getAllRooms', this.socket.id);
      this.socket.emit('sendCurrentUserNameAndEmail', name, email);
    });

    this.socket.on('returnAllRooms', (allRooms) => {
      dispatch(updateAllRooms(allRooms));
    });

    this.socket.on('createRoomCompleted', (roomInfo, allRooms) => {
      dispatch(updateAllRooms(allRooms));
      dispatch(updateRoomInfo(roomInfo));
      this.socket.emit('getAllRooms', this.socket.id);
    });

    this.socket.on('joinRoomCompleted', (roomInfo, allRooms, game) => {
      dispatch(selectRoomClose());
      dispatch(updateAllRooms(allRooms));
      dispatch(updateRoomInfo(roomInfo));
      if (game) {
        dispatch(receiveGame(game));
      }
      dispatch(updateTimer(roomInfo));
      dispatch(turnClockOn());
      if (gameMode !== 'AI' && gameTurn !== 'W') {
        this.decrementTimerW();
      } else {
        this.toggleTimers();
      }
    });

    this.socket.on('messageLocal', (msg) => {
      dispatch(sendMsgLocal(msg));
    });

    this.socket.on('messageGlobal', (msg) => {
      dispatch(sendMsgGlobal(msg));
    });

    this.socket.on('attemptMoveResult', (error, game, origin, dest, selection) => {
      // console.log('+++++++++++++++++++++++++++++move: ', game.event);
      // if gameTurn color and the captured piece color are opposite,
      // that means it is a win,
      // if the gameTurn color and the captured piece's color are the same
      // that measn it is on the losing side
      if (error === null) {
        // if (pawnPromotionPiece) {
        //   dispatch(pawnPromotionMove(origin, dest, pawnPromotionPiece, gameTurn));
        // } else if (castling) {
        //   dispatch(castlingMove(origin, dest, castling, gameTurn));
        // } else if (enPassantCoord) {
        //   dispatch(enPassantMove(origin, dest, enPassantCoord, gameTurn));
        // } else if (selection) {
        //   dispatch(capturePiece(origin, dest, selection, gameTurn));
        // } else {
        //   dispatch(movePiece(origin, dest, gameTurn));
        // }
        const captureTable = {
          BP: 'capture',
          BB: 'capture',
          BR: 'capture',
          BN: 'capture',
          BQ: 'capture',
          WP: 'capture',
          WB: 'capture',
          WR: 'capture',
          WN: 'capture',
          WQ: 'capture',
        };

        const specialTable = {
          '+B': 'check',
          '+W': 'check',
          '#B': 'checkMate',
          '#W': 'checkMate',
          '=BQ': 'promotion',
          '=WQ': 'promotion',
          enpassant: 'enpassant',
          castle: 'castle',
        };

        let intent = '';
        let text = '';

        if (game.event.length !== 0) {
          const { gameTurn, thisUser, playerW, playerB, snackbarOpen } = this.props;
          for (let i = 0; i < game.event.length; i += 1) {
            // for capture event
            if (captureTable.hasOwnProperty(game.event[i])) {
              if (thisUser === playerW) {
                if (game.event[i][0] === 'W') {
                  intent = `${captureTable[game.event[i]]}Lose`;
                } else {
                  intent = `${captureTable[game.event[i]]}Win`;
                }
              }
              if (thisUser === playerB) {
                if (game.event[i][0] === 'B') {
                  intent = `${captureTable[game.event[i]]}Lose`;
                } else {
                  intent = `${captureTable[game.event[i]]}Win`;
                }
              }
            }
            // for special events
            if (specialTable.hasOwnProperty(game.event[i])) {
              if (thisUser === playerW) {
                if (game.event[i] === '+B') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === '+W') {
                  intent = `${specialTable[game.event[i]]}Lose`;
                }
                if (game.event[i] === '#B') {
                  intent = `${specialTable[game.event[i]]}Lose`;
                }
                if (game.event[i] === '#W') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === '=BQ') {
                  intent = `${specialTable[game.event[i]]}Lose`;
                }
                if (game.event[i] === '=WQ') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === 'enpassant' && gameTurn === 'W') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === 'castle' && gameTurn === 'W' && thisUser === playerW) {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
              }
              if (thisUser === playerB) {
                if (game.event[i] === '+B') {
                  intent = `${specialTable[game.event[i]]}Lose`;
                }
                if (game.event[i] === '+W') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === '#B') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === '#W') {
                  intent = `${specialTable[game.event[i]]}Lose`;
                }
                if (game.event[i] === '=BQ') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === '=WQ') {
                  intent = `${specialTable[game.event[i]]}Lose`;
                }
                if (game.event[i] === 'enpassant' && gameTurn === 'B') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
                if (game.event[i] === 'castle' && gameTurn === 'B' && thisUser === playerB) {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
              }
            }
            if (intent.slice(-3) === 'Win') {
              text = `${game.event[i]}W`;
            } else {
              text = game.event[i];
            }
            if (intent !== '') {
              if (text === '+BW' || text === '+WW' || text === '+B' || text === '+W') {
                dispatch(turnSnackbarOn());
              }
              this.conversation(text, intent);
            }
          }
        }
        dispatch(receiveGame(game));
        if (game.winner) {
          const { playerW, playerB } = this.props;
          let winner = null;
          if (game.winner === 'W') {
            dispatch(openWinnerDialog(playerW));
          } else {
            dispatch(openWinnerDialog(playerB));
          }
        } else if (game.playerInCheck) {
          dispatch(openCheckDialog(game.playerInCheck));
        }
        this.toggleTimers();
      } else {
        console.log('ERROR: ', error);
        const { playerW, playerB, gameTurn } = this.props;
        // dispatch(displayError(error));
        if (((gameTurn === 'W' && thisUser === playerW)
          || (gameTurn === 'B' && thisUser === playerB))) {
          // this.conversation(error);
          this.renderError(error);
        }
      }
      dispatch(unselectPiece());
      dispatch(resetBoolBoard());
      dispatch(colorSquare(null, dest));
    });

    this.socket.on('checkLegalMovesResults', (boolBoard) => {
      dispatch(saveBoolBoard(boolBoard));
    });

    this.socket.on('requestPauseDialogBox', () => {
      this.handlePauseOpen();
    });

    this.socket.on('rejectPauseRequestNotification', () => {
      const { count } = this.props;
      this.socket.emit('handleRejectPauseRequest', count, this.socket.id);
    });

    this.socket.on('cancelPauseNotification', (playerName) => {
      dispatch(updateAlertName(playerName));
      dispatch(cancelPauseDialogOpen());
      setTimeout(() => {
        dispatch(cancelPauseDialogClose());
        dispatch(pauseDialogClose());
      }, 3000);
    });

    this.socket.on('executePauseRequest', () => {
      dispatch(toggleSystemPause());
      this.renderError('game has paused!');
      this.onChangePlayerTurn();
    });

    this.socket.on('requestResumeDialogBox', () => {
      this.handleResumeOpen();
    });

    this.socket.on('rejectResumeRequestNotification', () => {
      const { count } = this.props;
      this.socket.emit('handleRejectResumeRequest', count, this.socket.id);
    });

    this.socket.on('cancelResumeNotification', (playerName) => {
      dispatch(updateAlertName(playerName));
      dispatch(cancelResumeDialogOpen());
      setTimeout(() => {
        dispatch(cancelResumeDialogClose());
        dispatch(resumeDialogClose());
      }, 3000);
    });

    this.socket.on('executeResumeRequest', () => {
      const { dispatch, gameTurn } = this.props;
      this.renderError('game has resumed!');
      dispatch(toggleSystemPause());
      if (gameTurn === 'W') {
        this.decrementTimerW();
      }
      if (gameTurn === 'B') {
        this.decrementTimerB();
      }
    });

    this.socket.on('announceSurrender', (playerName) => {
      const { playerW, playerB, playerWemail, playerBemail } = this.props;
      if (playerName === playerW) {
        console.log('player W surrendered');
        this.updateUserGameStat(this.winLoseResult(playerBemail, playerWemail));
      } else if (playerName === playerB) {
        console.log('player B surrendered');
        this.updateUserGameStat(this.winLoseResult(playerWemail, playerBemail));
      }
      dispatch(updateAlertName(playerName));
      this.onChangePlayerTurn();
      this.handleAnnounceSurrenderOpen();
    });

    this.socket.on('sendUpdateTime', (roomInfo) => {
      dispatch(updateTimer(roomInfo));
    });

    this.socket.on('updateAllRooms', (allRooms, ) => {
      // if (roomInfo.playerW === undefined || roomInfo.playerB === undefined) {
      //   dispatch(turnClockOff());
      // }
      // dispatch(updateTimer(roomInfo));
      // dispatch(updateRoomInfo(roomInfo));
      dispatch(updateAllRooms(allRooms));
    });

    this.socket.on('beforeDisconnect', (playerName) => {
      console.log(`player ${playerName} has disconnected from the server`);
    });
  }

  // GAME control
  winLoseResult(player1, player2) {
    const arr = [];
    arr[0] = { winner: player1, win: 1, draw: 0, lose: 0 };
    arr[1] = { loser: player2, win: 0, draw: 0, lose: 1 };
    return arr;
  }

  toggleTimers() {
    const { gameTurn } = this.props;
    this.onChangePlayerTurn();
    if (gameTurn === 'B') {
      this.decrementTimerB();
    }
    if (gameTurn === 'W') {
      this.decrementTimerW();
    }
  }

  decrementTimerB() {
    const { dispatch, playerWemail, playerBemail, playerW } = this.props;
    let { timeB, counterBinstance } = this.props;
    counterBinstance = setInterval(() => {
      if (timeB > 0) {
        timeB -= 1;
      } else {
        timeB = 0;
        this.onTimeOut(playerW);
        this.updateUserGameStat(this.winLoseResult(playerWemail, playerBemail));
      }
      dispatch(updateTimerB(timeB));
      dispatch(timeInstanceB(counterBinstance));
    }, 1000);
  }

  decrementTimerW() {
    const { dispatch, playerWemail, playerBemail, playerB } = this.props;
    let { timeW, counterWinstance } = this.props;
    counterWinstance = setInterval(() => {
      if (timeW > 0) {
        timeW -= 1;
      } else {
        timeW = 0;
        this.onTimeOut(playerB);
        this.updateUserGameStat(this.winLoseResult(playerWemail, playerBemail));
      }
      dispatch(updateTimerW(timeW));
      dispatch(timeInstanceW(counterWinstance));
    }, 1000);
  }

  onTimeOut(player) {
    const { dispatch } = this.props;
    this.onChangePlayerTurn();
    dispatch(updateAlertName(player));
    dispatch(timeoutDialogOpen());
  }

  stopTimerB() {
    const { dispatch, timeB, counterBinstance } = this.props;
    dispatch(updateTimerB(timeB));
    clearInterval(counterBinstance);
  }

  stopTimerW() {
    const { dispatch, timeW, counterWinstance } = this.props;
    dispatch(updateTimerW(timeW));
    clearInterval(counterWinstance);
  }

  // CONTROL function
  closeDialog() {
    const { dispatch } = this.props;
    dispatch(selectRoomClose());
    window.location = '/login';
  }

  goToLobby() {
    window.location = '/';
  }

  handleSurrender() {
    const { dispatch } = this.props;
    dispatch(confirmSurrenderDialogOpen());
  }

  handleConfirmSurrenderOpen() {
    const { dispatch, thisUser, room } = this.props;
    dispatch(confirmSurrenderDialogClose());
    this.socket.emit('onSurrender', thisUser, room);
  }

  handleCreateRoomAsBlack(mode) {
    const { dispatch, thisUser, thisEmail } = this.props;
    dispatch(updateGameMode(mode));
    this.socket.emit('createRoomAsBlack', thisUser, thisEmail, this.socket.id, mode);
  }

  handleCreateRoomAsWhite(mode) {
    const { dispatch, thisUser, thisEmail } = this.props;
    dispatch(updateGameMode(mode));
    this.socket.emit('createRoomAsWhite', thisUser, thisEmail, this.socket.id, mode);
  }

  handleJoinRoomAsWhite(count) {
    const { dispatch, thisUser, thisEmail } = this.props;
    this.socket.emit('joinRoomAsWhite', thisUser, thisEmail, count);
    dispatch(selectRoomClose());
  }

  handleJoinRoomAsBlack(count) {
    const { dispatch, thisUser, thisEmail } = this.props;
    this.socket.emit('joinRoomAsBlack', thisUser, thisEmail, count);
    dispatch(selectRoomClose());
  }

  onAgreePauseRequest() {
    const { dispatch, count, gameMode } = this.props;
    dispatch(pauseDialogClose());
    this.socket.emit('agreePauseRequest', count, this.socket.id, gameMode);
  }

  onCancelPauseRequest() {
    const { dispatch, room } = this.props;
    dispatch(pauseDialogClose());
    this.socket.emit('rejectPauseRequest', room);
  }

  handleCancelPauseClose() {
    const { dispatch } = this.props;
    dispatch(pauseDialogClose());
    dispatch(cancelPauseDialogClose());
  }

  sendPauseRequest() {
    const { room, systemPause } = this.props;
    if (systemPause === true) {
      this.renderError('game is already in pause :)');
    } else {
      this.socket.emit('requestPause', room);
    }
  }

  sendResumeRequest() {
    const { room, systemPause } = this.props;
    if (systemPause === false) {
      this.renderError('current game is still running');
    } else {
      this.socket.emit('requestResume', room);
    }
  }

  onCancelResumeRequest() {
    const { dispatch, room } = this.props;
    dispatch(resumeDialogClose());
    this.socket.emit('rejectResumeRequest', room);
  }

  onAgreeResumeRequest() {
    const { dispatch, count, gameMode } = this.props;
    dispatch(resumeDialogClose());
    this.socket.emit('agreeResumeRequest', count, this.socket.id, gameMode);
  }

  handleCancelResumeClose() {
    const { dispatch } = this.props;
    dispatch(resumeDialogClose());
    dispatch(cancelResumeDialogClose());
  }

  handleResumeOpen() {
    const { dispatch } = this.props;
    dispatch(resumeDialogOpen());
  }

  handleResumeClose() {
    const { dispatch } = this.props;
    dispatch(resumeDialogClose());
  }

  handlePauseOpen() {
    const { dispatch } = this.props;
    dispatch(pauseDialogOpen());
  }

  handlePauseClose() {
    const { dispatch } = this.props;
    dispatch(pauseDialogClose());
  }

  handleAnnounceSurrenderClose() {
    const { dispatch } = this.props;
    dispatch(announceSurrenderDialogClose());
    dispatch(confirmSurrenderDialogClose());
    dispatch(timeoutDialogClose());
  }

  handleAnnounceSurrenderOpen() {
    const { dispatch } = this.props;
    dispatch(announceSurrenderDialogOpen());
  }

  handleLobbyOpen() {
    const { dispatch } = this.props;
    dispatch(selectRoomOpen());
  }
  // LOGIC
  newChessGame() {
    const { dispatch } = this.props;
    console.log('make new game');
    this.socket.emit('newChessGame');
    this.socket.on('createdChessGame', game => dispatch(receiveGame(game)));
  }

  attemptMove(origin, dest, selection, room, pawnPromoteType = null, gameMode) {
    // const { dispatch, room} = this.props;
    console.log('sending origin and dest coordinates to server');
    this.socket.emit('attemptMove', origin, dest, selection, pawnPromoteType, room, gameMode);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  checkLegalMoves(origin, room) {
    // const { dispatch } = this.props;
    console.log('checking legal moves');
    this.socket.emit('checkLegalMoves', origin, room, this.socket.id);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  sendMessageLocal(msg) {
    const { count } = this.props;
    this.socket.emit('messageLocal', msg, count);
  }

  sendMessageGlobal(msg) {
    const { count } = this.props;
    this.socket.emit('messageGlobal', msg, count);
  }

  render() {
    const {
      alertName, cancelPauseOpen, pauseOpen, moveHistory,
      capturedPiecesBlack, capturedPiecesWhite, resumeOpen,
      playerB, playerW, error, messagesLocal, messagesGlobal, isWhite, thisUser,
      chooseGameModeOpen, chooseRoomOpen, chooseSideOpen, allRooms,
      cancelResumeOpen, surrenderOpen, gameMode, showClock, surrenderConfirmOpen,
      snackbarOpen, timeoutOpen,
    } = this.props;

    const pauseActions = [
      <FlatButton
        label="No"
        primary
        style={actionStyle}
        onTouchTap={this.onCancelPauseRequest}
      />,
      <FlatButton
        label="Yes"
        primary
        style={actionStyle}
        onTouchTap={this.onAgreePauseRequest}
      />,
    ];

    const resumeActions = [
      <FlatButton
        label="No"
        primary
        style={actionStyle}
        onTouchTap={this.onCancelResumeRequest}
      />,
      <FlatButton
        label="yes"
        primary
        style={actionStyle}
        onTouchTap={this.onAgreeResumeRequest}
      />,
    ];

    const cancelPauseActions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        style={actionStyle}
        onTouchTap={this.handleCancelPauseClose}
      />,
    ];

    const cancelResumeActions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        style={actionStyle}
        onTouchTap={this.handleCancelResumeClose}
      />,
    ];

    const selectRoomActions = [
      <RaisedButton
        label="Log out"
        backgroundColor="#F44336"
        labelColor="white"
        keyboardFocused
        onTouchTap={this.closeDialog}
      />,
    ];

    const surrenderActions = [
      <RaisedButton
        label="Ok"
        primary
        style={actionStyle}
        onTouchTap={this.handleAnnounceSurrenderClose}
      />,
      <RaisedButton
        label="Back to Lobby"
        secondary
        style={actionStyle}
        onTouchTap={this.goToLobby}
      />,
    ];

    const confirmSurrenderActions = [
      <RaisedButton
        label="No"
        secondary
        style={actionStyle}
        onTouchTap={this.handleAnnounceSurrenderClose}
      />,
      <RaisedButton
        label="Yes"
        primary
        style={actionStyle}
        onTouchTap={this.handleConfirmSurrenderOpen}
      />,
    ];

    const actionStyle = {
      margin: '3px',
      padding: '3px',
    };
    return (
      <div className="site-wrap">
        <Header
          sendPauseRequest={this.sendPauseRequest}
          sendResumeRequest={this.sendResumeRequest}
          handleSurrender={this.handleSurrender}
          handleLobbyOpen={this.handleLobbyOpen}
        />
        <div className="content">
          <div className="flex-row">
            <Paper
              className="flex-col left-col"
              zDepth={2}
            >
              <div className="left-col-row">
                <div className="player-top">
                  <PlayerName
                    color={(!isWhite) ? 'White' : 'Black'}
                    player={(!isWhite) ? playerW : playerB}
                    position="top"
                  />
                </div>
                <div className="countdown-top-clock">
                  {(playerB !== undefined && showClock === true) ?
                    <Clock color={(!isWhite) ? 'White' : 'Black'} /> : null
                  }
                </div>
                <MoveHistory
                  moveHistory={moveHistory}
                />
                <div className="countdown-bot-clock">
                  {(playerB !== undefined && showClock === true) ?
                    <Clock color={(isWhite) ? 'White' : 'Black'} /> : null
                  }
                </div>
                <div className="player-bot">
                  <PlayerName
                    color={(isWhite) ? 'White' : 'Black'}
                    player={(isWhite) ? playerW : playerB}
                    position="bot"
                  />
                </div>
              </div>
            </Paper>
            <Paper style={{ backgroundColor: '#78909C' }} className="flex-col capt-col" zDepth={2}>
              <div className="flex-col capt-black-col">
                <CapturedPieces
                  color={(!isWhite) ? 'White' : 'Black'}
                  capturedPieces={(!isWhite) ? capturedPiecesWhite : capturedPiecesBlack}
                  player={(!isWhite) ? playerW : playerB}
                />
              </div>
              <div className="flex-col capt-black-col">
                <CapturedPieces
                  color={(isWhite) ? 'White' : 'Black'}
                  capturedPieces={(isWhite) ? capturedPiecesWhite : capturedPiecesBlack}
                  player={(isWhite) ? playerW : playerB}
                />
              </div>
            </Paper>
            <div className="flex-col">
              <Board
                goToLobby={this.goToLobby}
                attemptMove={this.attemptMove}
                checkLegalMoves={this.checkLegalMoves}
                conversation={this.conversation}
                renderError={this.renderError}
              />
              {/* <Message message={message} />
              <Message message={error} /> */}
            </div>

            <Paper className="flex-col right-col" zDepth={2}>
              <Messages
                messagesLocal={messagesLocal}
                sendMessageLocal={this.sendMessageLocal}
                messagesGlobal={messagesGlobal}
                sendMessageGlobal={this.sendMessageGlobal}
                isWhite={isWhite}
                thisUser={thisUser}
                gameMode={gameMode}
              />
            </Paper>

            <div className="control-general">
              <Alert
                className="pause-request"
                title="Would you like to pause this game?"
                actions={pauseActions}
                persist
                open={pauseOpen}
                handleClose={this.handlePauseClose}
              />
              <Alert
                className="cancel-pause-request"
                title={`Pause request has been denied by ${alertName}`}
                actions={cancelPauseActions}
                open={cancelPauseOpen}
                handleClose={this.handleCancelPauseClose}
              />
              <Alert
                className="resume-request"
                title="Are you ready to resume game?"
                actions={resumeActions}
                open={resumeOpen}
                persist
                handleClose={this.handleCancelResumeClose}
              />
              <Alert
                className="cancel-resume-request"
                title={`Resume request has been denied by ${alertName}`}
                actions={cancelResumeActions}
                open={cancelResumeOpen}
                handleClose={this.handleCancelResumeClose}
              />
              <Alert
                className="announce-surrender"
                title={`${alertName} has surrendered.`}
                actions={surrenderActions}
                open={surrenderOpen}
                handleClose={this.handleAnnounceSurrenderClose}
              />
              <Alert
                className="confirm-surrender"
                title={'Are you sure you wish to surrender?'}
                actions={confirmSurrenderActions}
                open={surrenderConfirmOpen}
                handleClose={this.handleAnnounceSurrenderClose}
              />
            </div>
            <div className="control-room">
              <AlertRoom
                thisUser={thisUser}
                allRooms={allRooms}
                handleCreateRoomAsWhite={this.handleCreateRoomAsWhite}
                handleCreateRoomAsBlack={this.handleCreateRoomAsBlack}
                handleJoinRoomAsBlack={this.handleJoinRoomAsBlack}
                handleJoinRoomAsWhite={this.handleJoinRoomAsWhite}
                sendMessageGlobal={this.sendMessageGlobal}
                sendMessageLocal={this.sendMessageLocal}
                messagesGlobal={messagesGlobal}
                messagesLocal={messagesLocal}
                isWhite={isWhite}
                showRooms
                title={'Join or create a room:'}
                actions={selectRoomActions}
                // actionsContainerStyle={{padding: '10vw'}}
                open={chooseRoomOpen}
                actionsContainerClassName="test"
                bodyClassName="test"
                className="test"
                contentClassName="test"
                overlayClassName="test"
                titleClassName="test"
              />
              <Alert
                className="timeout-dialog"
                title={`Out of time, ${alertName} is the Chess Master!`}
                actions={surrenderActions}
                open={timeoutOpen}
              />
            </div>
            <div className="snack-bar">
              <SnackBar />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { gameState, moveState, userState, controlState } = state;
  const {
    gameMode,
    gameTurn,
    counterBinstance,
    counterWinstance,
    timeB,
    timeW,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    messagesLocal,
    messagesGlobal,
  } = gameState;
  const {
    thisEmail,
    roomQueue,
    allRooms,
    thisUser,
    playerWemail,
    playerBemail,
    playerW,
    playerB,
    room,
    isWhite,
    count,
  } = userState;
  const { message, error } = moveState;
  const {
    timeoutOpen,
    snackbarOpen,
    surrenderConfirmOpen,
    systemPause,
    showClock,
    surrenderOpen,
    resumeOpen,
    pauseOpen,
    cancelResumeOpen,
    cancelPauseOpen,
    alertName,
    chooseGameModeOpen,
    chooseRoomOpen,
    chooseSideOpen,
  } = controlState;
  return {
    timeoutOpen,
    snackbarOpen,
    surrenderConfirmOpen,
    systemPause,
    showClock,
    gameMode,
    surrenderOpen,
    cancelResumeOpen,
    resumeOpen,
    thisEmail,
    count,
    roomQueue,
    allRooms,
    chooseSideOpen,
    chooseRoomOpen,
    thisUser,
    chooseGameModeOpen,
    gameTurn,
    counterBinstance,
    counterWinstance,
    playerWemail,
    playerBemail,
    timeB,
    timeW,
    alertName,
    cancelPauseOpen,
    pauseOpen,
    room,
    playerB,
    playerW,
    message,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    error,
    messagesLocal,
    messagesGlobal,
    isWhite,
  };
}

export default connect(mapStateToProps)(App);
