import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  updateTimer, cancelPauseDialogClose, updateAlertName,
  cancelPauseDialogOpen, pauseDialogOpen, pauseDialogClose, setPlayer,
  updateRoomInfo, getRequestFailure, receiveGame, movePiece, resetBoolBoard,
  unselectPiece, capturePiece, displayError, colorSquare, sendMsgLocal, sendMsgGlobal,
  updateTimerB, timeInstanceB, updateTimerW, timeInstanceW, saveBoolBoard, castlingMove,
  selectGameModeClose, selectRoomOpen, selectRoomClose,
  selectSideOpen, selectSideClose, updateAllRooms, updateRoomQueue, setPlayerId,
  enPassantMove, pawnPromotionMove, resumeDialogOpen, resumeDialogClose, cancelResumeDialogOpen,
  cancelResumeDialogClose, announceSurrenderDialogOpen, announceSurrenderDialogClose,
  updateGameMode, openWinnerDialog, openCheckDialog,
} from '../store/actions';
// Components
import Header from '../components/Header';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import Alert from './Alert';
import PlayerName from '../components/PlayerName';
import Clock from '../components/Clock';
import Messages from '../components/Messages';
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
  }

  componentDidMount() {
    this.getUserInfo();
    this.conversation('captureWin', 'WP');
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
  // this.conversation(`${player1}-win`);
  conversation(context, message) {
    const text = message || '';
    const intent = context || '';
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
        console.log('message sent!', response);
        const { dispatch, playerW, playerB, playerWid, playerBid, thisUser, thisUserId} = this.props;
        console.log('message: ', response.data.output);
      })
      .catch((err) => {
        console.error('failed to send message to watson conversation service: ', err);
      });
  }

  updateUserGameStat(arr) {
    axios.post('/api/game/updateUserGameStat', arr)
      .then((response) => {
        console.log('successfully sent user win lose information to server: ', response);
      })
      .catch((err) => {
        console.error('failed to send user win lose information to the server! ', err);
      });
  }

  startSocket() {
    const { dispatch, thisUser, thisEmail, playerB, playerW } = this.props;
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
      dispatch(updateTimer(roomInfo));
      if (game) {
        dispatch(receiveGame(game));
      }
      this.decrementTimerW();
    });

    this.socket.on('messageLocal', (msg) => {
      dispatch(sendMsgLocal(msg));
    });

    this.socket.on('messageGlobal', (msg) => {
      dispatch(sendMsgGlobal(msg));
    });

    this.socket.on('attemptMoveResult', (error, game, origin, dest, selection) => {
      console.log('+++++++++++++++++++++++++++++move: ', game.event);
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
          'enpassant': 'enpassant',
          'castle': 'castle',
        };
        
        var intent = '';

        if (game.event.length !== 0) {
          const { gameTurn, thisUser, playerW, playerB } = this.props;
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
                if (game.event[i] === 'castle' && gameTurn === 'W') {
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
                if (game.event[i] === 'castle' && gameTurn === 'B') {
                  intent = `${specialTable[game.event[i]]}Win`;
                }
              }
            }
            //  else if (specialTable.hasOwnProperty(game.event[i])) {
            //   if (thisUser === playerW) {
            //     if (game.event[i][1] === 'B') {
            //       if (game.event[i][0] === '#') {
            //         intent = `${specialTable[game.event[i]]}Lose`;
            //       } else if (game.event[i][0] === '+') {
            //         intent = `${specialTable[game.event[i]]}Win`;
            //       }
            //     } else if (game.event[i][1] === 'W') {
            //       if (game.event[i][0] === '#') {
            //         intent = `${specialTable[game.event[i]]}Win`;
            //       }
            //       if (game.event[i][0] === '+') {
            //         intent = `${specialTable[game.event[i]]}Lose`;
            //       }
            //     } else if ((game.event === 'castle' || game.event === 'enpassant') && gameTurn === 'W') {
            //       intent = `${specialTable[game.event[i]]}Win`;
            //     }
            //   }
            //   if (thisUser === playerB) {
            //     if (game.event[i][1] === 'W') {
            //       if (game.event[i][0] === '#') {
            //         intent = `${specialTable[game.event[i]]}Lose`;
            //       }
            //       if (game.event[i][0] === '+') {
            //         intent = `${specialTable[game.event[i]]}Win`;
            //       }
            //     } else if (game.event[i][1] === 'B') {
            //       if (game.event[i][0] === '#') {
            //         intent = `${specialTable[game.event[i]]}Win`;
            //       }
            //       if (game.event[i][0] === '+') {
            //         intent = `${specialTable[game.event[i]]}Lose`;
            //       }
            //     } else if ((game.event === 'castle' || game.event === 'enpassant') && gameTurn === 'B') {
            //       intent = `${specialTable[game.event[i]]}Win`;
            //     }
            //   }
            // }
            console.log('//////////////intent: ', intent);
          }
        }
        dispatch(receiveGame(game));
        if (game.winner) {
          dispatch(openWinnerDialog(game.winner));
        } else if (game.playerInCheck) {
          dispatch(openCheckDialog(game.playerInCheck));
        }
        this.toggleTimers();
      } else {
        console.log('ERROR: ', error);
        dispatch(displayError(error));
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
      const { gameTurn } = this.props;
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

    this.socket.on('updateAllRooms', (allRooms) => {
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
    const { dispatch, playerWemail, playerBemail } = this.props;
    let { timeB, counterBinstance } = this.props;
    counterBinstance = setInterval(() => {
      if (timeB > 0) {
        timeB -= 1;
      } else {
        timeB = 0;
        this.stopTimerB();
        this.updateUserGameStat(this.winLoseResult(playerWemail, playerBemail));
      }
      dispatch(updateTimerB(timeB));
      dispatch(timeInstanceB(counterBinstance));
    }, 1000);
  }

  decrementTimerW() {
    const { dispatch, playerWemail, playerBemail } = this.props;
    let { timeW, counterWinstance } = this.props;
    counterWinstance = setInterval(() => {
      if (timeW > 0) {
        timeW -= 1;
      } else {
        timeW = 0;
        this.stopTimerW();
        this.updateUserGameStat(this.winLoseResult(playerWemail, playerBemail));
      }
      dispatch(updateTimerW(timeW));
      dispatch(timeInstanceW(counterWinstance));
    }, 1000);
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
  }

  handleSurrender() {
    const { thisUser, room } = this.props;
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
    const { dispatch, count } = this.props;
    dispatch(pauseDialogClose());
    this.socket.emit('agreePauseRequest', count, this.socket.id);
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
    const { room } = this.props;
    this.socket.emit('requestPause', room);
  }

  sendResumeRequest() {
    const { room } = this.props;
    this.socket.emit('requestResume', room);
  }

  onCancelResumeRequest() {
    const { dispatch, room } = this.props;
    dispatch(resumeDialogClose());
    this.socket.emit('rejectResumeRequest', room);
  }

  onAgreeResumeRequest() {
    const { dispatch, count } = this.props;
    dispatch(resumeDialogClose());
    this.socket.emit('agreeResumeRequest', count, this.socket.id);
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
  }

  handleAnnounceSurrenderOpen() {
    const { dispatch } = this.props;
    dispatch(announceSurrenderDialogOpen());
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
      cancelResumeOpen, surrenderOpen,
    } = this.props;

    const pauseActions = [
      <FlatButton
        label="No"
        primary
        onTouchTap={this.onCancelPauseRequest}
      />,
      <FlatButton
        label="Yes"
        primary
        keyboardFocused
        onTouchTap={this.onAgreePauseRequest}
      />,
    ];

    const resumeActions = [
      <FlatButton
        label="No"
        primary
        onTouchTap={this.onCancelResumeRequest}
      />,
      <FlatButton
        label="yes"
        primary
        onTouchTap={this.onAgreeResumeRequest}
      />,
    ];

    const cancelPauseActions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.handleCancelPauseClose}
      />,
    ];

    const cancelResumeActions = [
      <FlatButton
        label="Ok"
        primary
        keyboardFocused
        onTouchTap={this.handleCancelResumeClose}
      />,
    ];

    const selectRoomActions = [
      <RaisedButton
        label="Close"
        secondary
        keyboardFocused
        onTouchTap={this.closeDialog}
      />,
    ];

    const surrenderActions = [
      <RaisedButton
        label="Ok"
        secondary
        onTouchTap={this.handleAnnounceSurrenderClose}
      />,
    ];

    return (
      <div className="site-wrap">
        <Header
          sendPauseRequest={this.sendPauseRequest}
          sendResumeRequest={this.sendResumeRequest}
          handleSurrender={this.handleSurrender}
        />
        <div className="content">
          <div className="flex-row">
            <div className="flex-col left-col">
              <div className="left-col-row">
                <div className="player-top">
                  <PlayerName
                    color={(!isWhite) ? 'White' : 'Black'}
                    player={(!isWhite) ? playerW : playerB}
                    position="top"
                  />
                </div>
                <div className="countdown-top-clock">
                  {(playerB !== undefined) ?
                    <Clock color={(!isWhite) ? 'White' : 'Black'} /> : null
                  }
                </div>
                <div className="move-history">
                  <MoveHistory
                    moveHistory={moveHistory}
                  />
                </div>
                <div className="countdown-bot-clock">
                  {(playerB !== undefined) ?
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
            </div>
            <div className="flex-col capt-col">
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
            </div>
            <div className="flex-col">
              <Board attemptMove={this.attemptMove} checkLegalMoves={this.checkLegalMoves} />
              {/* <Message message={message} />
              <Message message={error} /> */}
            </div>

            <div className="flex-col right-col">
              <Message message={error} />
              <Messages
                messagesLocal={messagesLocal}
                sendMessageLocal={this.sendMessageLocal}
                messagesGlobal={messagesGlobal}
                sendMessageGlobal={this.sendMessageGlobal}
                isWhite={isWhite}
                thisUser={thisUser}
              />
            </div>

            <div className="control-general">
              <Alert
                className="pause-request"
                title="Would you like to pause this game?"
                actions={pauseActions}
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
                title="Are you ready to resume this game?"
                actions={resumeActions}
                open={resumeOpen}
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
                title={`${alertName} has surrendered`}
                actions={surrenderActions}
                open={surrenderOpen}
                handleClose={this.handleAnnounceSurrenderClose}
              />
            </div>
            <div className="control-room">
              <Alert
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
                className="choose-room"
                title={'Choose or create a room to join:'}
                actions={selectRoomActions}
                open={chooseRoomOpen}
              />
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
