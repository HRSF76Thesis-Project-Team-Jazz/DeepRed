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
  unselectPiece, capturePiece, displayError, colorSquare, sendMsg,
  updateTimerB, timeInstanceB, updateTimerW, timeInstanceW, saveBoolBoard, castlingMove,
  selectGameModeClose, selectGameModeOpen, selectRoomOpen, selectRoomClose,
  selectSideOpen, selectSideClose, updateAllRooms, updateRoomQueue, setPlayerId,
  enPassantMove, pawnPromotionMove, resumeDialogOpen, resumeDialogClose, cancelResumeDialogOpen,
  cancelResumeDialogClose, announceSurrenderDialogOpen, announceSurrenderDialogClose,
  openWinnerDialog, openCheckDialog,
} from '../store/actions';
import ScrollArea from 'react-scrollbar';

// Components
import Header from '../components/Header';
import Board from './Board';
import Message from '../components/Message';
import CapturedPieces from '../components/CapturedPieces';
import MoveHistory from '../components/MoveHistory';
import Alert from './Alert';
import ChatBox from '../components/ChatBox';
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
    this.sendPauseRequest = this.sendPauseRequest.bind(this);
    this.sendResumeRequest = this.sendResumeRequest.bind(this);
    this.handlePauseOpen = this.handlePauseOpen.bind(this);
    this.handlePauseClose = this.handlePauseClose.bind(this);
    this.sendMessage = this.sendMessage.bind(this);
    this.onCancelPauseRequest = this.onCancelPauseRequest.bind(this);
    this.handleCancelPauseClose = this.handleCancelPauseClose.bind(this);
    this.onAgreePauseRequest = this.onAgreePauseRequest.bind(this);
    this.onChangePlayerTurn = this.onChangePlayerTurn.bind(this);
    this.decrementTimerB = this.decrementTimerB.bind(this);
    this.decrementTimerW = this.decrementTimerW.bind(this);
    this.stopTimerB = this.stopTimerB.bind(this);
    this.stopTimerW = this.stopTimerW.bind(this);
    this.toggleTimers = this.toggleTimers.bind(this);
    this.onPVPmodeSelected = this.onPVPmodeSelected.bind(this);
    this.onPVCmodeSelected = this.onPVCmodeSelected.bind(this);
    this.onCVCmodeSelected = this.onCVCmodeSelected.bind(this);
    this.handleSelectRoomCloseOnFailure = this.handleSelectRoomCloseOnFailure.bind(this);
    this.handleSelectSideCloseOnFailure = this.handleSelectSideCloseOnFailure.bind(this);
    this.handleChooseGameModeOpen = this.handleChooseGameModeOpen.bind(this);
    this.createNewPVPRoom = this.createNewPVPRoom.bind(this);
    this.handleCreateRoomAsBlack = this.handleCreateRoomAsBlack.bind(this);
    this.handleCreateRoomAsWhite = this.handleCreateRoomAsWhite.bind(this);
    this.handleJoinRoomAsBlack = this.handleJoinRoomAsBlack.bind(this);
    this.handleJoinRoomAsWhite = this.handleJoinRoomAsWhite.bind(this);
    this.onPlayerWdefeat = this.onPlayerWdefeat.bind(this);
    this.onPlayerBdefeat = this.onPlayerWdefeat.bind(this);
    this.handleSurrender = this.handleSurrender.bind(this);
    this.handleResumeOpen = this.handleResumeOpen.bind(this);
    this.onCancelResumeRequest = this.onCancelResumeRequest.bind(this);
    this.onAgreeResumeRequest = this.onAgreeResumeRequest.bind(this);
    this.handleCancelResumeClose = this.handleCancelResumeClose.bind(this);
    this.handleAnnounceSurrenderOpen = this.handleAnnounceSurrenderOpen.bind(this);
    this.handleAnnounceSurrenderClose = this.handleAnnounceSurrenderClose.bind(this);
    this.updateUserGameStat = this.updateUserGameStat.bind(this);
  }

  componentDidMount() {
    this.getUserInfo();
  }

  getUserInfo() {
    const { dispatch } = this.props;
    axios.get('/api/profiles/id')
      .then((response) => {
        console.log('successfully fetched current user infomation: ');
        dispatch(setPlayer(response));
      })
      .then(() => {
        this.handleChooseGameModeOpen();
        this.startSocket();
      })
      .catch((err) => {
        dispatch(getRequestFailure(err));
        console.error('failed to obtain current user infomation!', err);
      });
  }

  updateUserGameStat() {
    axios.post('/api/game/updateUserGameStat')
      .then((response) => {
        console.log('successfully sent user win lose information to server: ', response);
      })
      .catch((err) => {
        console.error('failed to send user win lose information to the server! ', err);
      });
  }

  startSocket() {
    const { dispatch, playerW, playerWemail, gameTurn, timeB, timeW } = this.props;

    const name = playerW;
    const email = playerWemail;
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

    this.socket.on('createRoomAsWhiteComplete', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      this.socket.emit('getAllRooms', this.socket.id);
      dispatch(selectSideClose());
    });

    this.socket.on('createRoomAsBlackComplete', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      this.socket.emit('getAllRooms', this.socket.id);
      dispatch(selectSideClose());
    });

    this.socket.on('joinRoomAsWhiteComplete', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      dispatch(updateTimer(roomInfo));
      this.decrementTimerW();
    });

    this.socket.on('joinRoomAsBlackComplete', (roomInfo) => {
      dispatch(updateRoomInfo(roomInfo));
      dispatch(updateTimer(roomInfo));
      this.decrementTimerW();
    });

    this.socket.on('message', (msg) => {
      dispatch(sendMsg(msg));
    });

    this.socket.on('attemptMoveResult', (error, origin, dest, selection, gameTurn, castling, enPassantCoord, pawnPromotionPiece, playerInCheck, winner) => {
      if (error === null) {
        if (pawnPromotionPiece) {
          dispatch(pawnPromotionMove(origin, dest, pawnPromotionPiece, gameTurn));
        } else if (castling) {
          dispatch(castlingMove(origin, dest, castling, gameTurn));
        } else if (enPassantCoord) {
          dispatch(enPassantMove(origin, dest, enPassantCoord, gameTurn));
        } else if (selection) {
          dispatch(capturePiece(origin, dest, selection, gameTurn));
        } else {
          dispatch(movePiece(origin, dest, gameTurn));
        }
        if (winner) {
          dispatch(openWinnerDialog(winner));
        } else if (playerInCheck) {
          dispatch(openCheckDialog(playerInCheck));
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
      dispatch(updateAlertName(playerName));
      this.onChangePlayerTurn();
      this.updateUserGameStat();
      this.handleAnnounceSurrenderOpen();
    });

    this.socket.on('sendUpdateTime', (roomInfo) => {
      dispatch(updateTimer(roomInfo));
    });
  }

  // GAME control
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
    const { dispatch } = this.props;
    let { timeB, counterBinstance } = this.props;
    counterBinstance = setInterval(() => {
      if (timeB > 0) {
        timeB -= 1;
      } else {
        timeB = 0;
        this.stopTimerB();
        this.updateUserGameStat();
        // player B lose, fire signal to server
      }
      dispatch(updateTimerB(timeB));
      dispatch(timeInstanceB(counterBinstance));
    }, 1000);
  }

  decrementTimerW() {
    const { dispatch } = this.props;
    let { timeW, counterWinstance } = this.props;
    counterWinstance = setInterval(() => {
      if (timeW > 0) {
        timeW -= 1;
      } else {
        timeW = 0;
        this.stopTimerW();
        this.updateUserGameStat();
        // player W lose, fire signal to server
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

  onChangePlayerTurn() {
    const { room, count, timeB, timeW } = this.props;
    this.stopTimerB();
    this.stopTimerW();
    this.socket.emit('updateTime', room, count, timeB, timeW);
  }

  // CONTROL function
  onPlayerWdefeat() {

  }

  onPlayerBdefeat() {

  }

  handleSurrender() {
    const { thisUser, room } = this.props;
    this.socket.emit('onSurrender', thisUser, room);
  }

  createNewPVPRoom() {
    const { dispatch } = this.props;
    dispatch(selectRoomClose());
    dispatch(selectSideOpen());
  }

  handleCreateRoomAsBlack() {
    const { thisUser, thisEmail } = this.props;
    this.socket.emit('createRoomAsBlack', thisUser, thisEmail, this.socket.id);
  }

  handleCreateRoomAsWhite() {
    const { thisUser, thisEmail } = this.props;
    this.socket.emit('createRoomAsWhite', thisUser, thisEmail, this.socket.id);
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

  handleChooseGameModeOpen() {
    const { dispatch } = this.props;
    dispatch(selectGameModeOpen());
  }


  handleSelectSideCloseOnFailure() {
    const { dispatch } = this.props;
    dispatch(selectSideClose());
    dispatch(selectGameModeOpen());
  }

  handleSelectRoomCloseOnFailure() {
    const { dispatch } = this.props;
    dispatch(selectRoomClose());
    this.handleChooseGameModeOpen();
  }

  onPVCmodeSelected() {
    const { dispatch } = this.props;
    dispatch(selectGameModeClose());
    dispatch(selectSideOpen());
  }

  onCVCmodeSelected() {
    const { dispatch } = this.props;
    dispatch(selectGameModeClose());
  }

  onPVPmodeSelected() {
    const { dispatch } = this.props;
    dispatch(selectGameModeClose());
    this.socket.emit('getAllRooms', this.socket.id);
    dispatch(selectRoomOpen());
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
    console.log('321');
    dispatch(announceSurrenderDialogClose());
  }

  handleAnnounceSurrenderOpen() {
    const { dispatch } = this.props;
    console.log('123');
    dispatch(announceSurrenderDialogOpen());
  }
  // LOGIC
  newChessGame() {
    const { dispatch } = this.props;
    console.log('make new game');
    this.socket.emit('newChessGame');
    this.socket.on('createdChessGame', game => dispatch(receiveGame(game)));
  }

  attemptMove(origin, dest, selection, room, pieceType = null) {
    // const { dispatch, room} = this.props;
    console.log('sending origin and dest coordinates to server');
    this.socket.emit('attemptMove', origin, dest, selection, pieceType, room, this.socket.id);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  checkLegalMoves(origin, room) {
    // const { dispatch } = this.props;
    console.log('checking legal moves');
    this.socket.emit('checkLegalMoves', origin, room, this.socket.id);
    // this.socket.emit('checkLegalMove', originDestCoord);
  }

  sendMessage(msg) {
    const { count } = this.props;
    this.socket.emit('message', msg, count);
  }

  render() {
    const {
      alertName, cancelPauseOpen, pauseOpen, moveHistory,
      capturedPiecesBlack, capturedPiecesWhite, resumeOpen,
      playerB, playerW, error, messages, isWhite, thisUser,
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
    const chooseGameModeActionsStyle = {
      margin: '1px',
      padding: '1px',
    };

    const chooseGameModeActions = [
      <RaisedButton
        style={chooseGameModeActionsStyle}
        label="Player vs Player"
        fullWidth
        secondary
        onTouchTap={this.onPVPmodeSelected}
      />,
      <RaisedButton
        style={chooseGameModeActionsStyle}
        label="Player vs AI"
        fullWidth
        secondary
        onTouchTap={this.onPVCmodeSelected}
      />,
      <RaisedButton
        style={chooseGameModeActionsStyle}
        label="AI vs AI"
        fullWidth
        secondary
        onTouchTap={this.onCVCmodeSelected}
      />,
    ];

    const selectRoomActions = [
      <RaisedButton
        label="Go back"
        secondary
        keyboardFocused
        onTouchTap={this.handleSelectRoomCloseOnFailure}
      />,
    ];

    const selectSideActionsStyle = {
      margin: '1px',
      padding: '1px',
    };

    const selectSideActions = [
      <RaisedButton
        label="White"
        style={selectSideActionsStyle}
        primary
        onTouchTap={this.handleCreateRoomAsWhite}
      />,
      <RaisedButton
        label="Black"
        style={selectSideActionsStyle}
        primary
        onTouchTap={this.handleCreateRoomAsBlack}
      />,
      <RaisedButton
        label="Go back"
        style={selectSideActionsStyle}
        secondary
        onTouchTap={this.handleSelectSideCloseOnFailure}
      />,
    ];

    const surrenderActions = [
      <RaisedButton
        label="Ok"
        style={selectSideActionsStyle}
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
              <ScrollArea>
              <Messages messages={messages} />
              </ScrollArea>
              <ChatBox sendMessage={this.sendMessage} />
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
                title={`Pause request has been canceled first by ${alertName}`}
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
                title={`Resume request has been canceled first by ${alertName}`}
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
            <div className="control-login">
              <Alert
                className="choose-mode"
                title={`Hi ${thisUser}, Welcome to DeepRed!`}
                actions={chooseGameModeActions}
                open={chooseGameModeOpen}
              />
            </div>
            <div className="control-room">
              <Alert
                createNewPVPRoom={this.createNewPVPRoom}
                allRooms={allRooms}
                handleJoinRoomAsBlack={this.handleJoinRoomAsBlack}
                handleJoinRoomAsWhite={this.handleJoinRoomAsWhite}
                showRooms
                className="choose-room"
                title={'Choose or create a room to join!'}
                actions={selectRoomActions}
                open={chooseRoomOpen}
              />
              <Alert
                className="choose-side"
                title={'which side would you like be on?'}
                actions={selectSideActions}
                open={chooseSideOpen}
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
    gameTurn,
    counterBinstance,
    counterWinstance,
    timeB,
    timeW,
    moveHistory,
    capturedPiecesBlack,
    capturedPiecesWhite,
    messages,
  } = gameState;
  const {
    thisEmail,
    roomQueue,
    allRooms,
    thisUser,
    playerWemail,
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
    messages,
    isWhite,
  };
}

export default connect(mapStateToProps)(App);
