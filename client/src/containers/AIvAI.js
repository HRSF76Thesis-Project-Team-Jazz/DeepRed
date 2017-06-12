import React, { Component } from 'react';
import { connect } from 'react-redux';
import io from 'socket.io-client';
import injectTapEventPlugin from 'react-tap-event-plugin';
import axios from 'axios';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import {
  updateTimer, cancelPauseDialogClose, updateAlertName,
} from '../store/actions';
import ScrollArea from 'react-scrollbar';

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
    this.handleSurrender = this.handleSurrender.bind(this);
    this.handleResumeOpen = this.handleResumeOpen.bind(this);
    this.onCancelResumeRequest = this.onCancelResumeRequest.bind(this);
    this.onAgreeResumeRequest = this.onAgreeResumeRequest.bind(this);
    this.handleCancelResumeClose = this.handleCancelResumeClose.bind(this);
    this.handleAnnounceSurrenderOpen = this.handleAnnounceSurrenderOpen.bind(this);
    this.handleAnnounceSurrenderClose = this.handleAnnounceSurrenderClose.bind(this);
    this.updateUserGameStat = this.updateUserGameStat.bind(this);
    this.winLoseResult = this.winLoseResult.bind(this);
  }

  componentDidMount() {
    this.startSocket();
  }

  startSocket() {
    const { dispatch, playerW, playerB, thisUser, thisEmail, room, count,
       gameTurn, timeB, timeW } = this.props;

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
  }

  // GAME control

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
  handleSurrender() {
    const { thisUser, room } = this.props;
    // this.socket.disconnect();
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
<<<<<<< HEAD
              {/* <Message message={message} />
              <Message message={error} /> */}
=======

>>>>>>> before rebase room resume state feature
            </div>

            <div className="flex-col right-col">
              <Message message={error} />
              <Messages messagesLocal={messagesLocal} sendMessageLocal={this.sendMessageLocal} messagesGlobal={messagesGlobal} sendMessageGlobal={this.sendMessageGlobal}/>
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
