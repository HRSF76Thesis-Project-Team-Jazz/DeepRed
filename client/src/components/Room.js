import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import MobileTearSheet from './MobileTearSheet';
import './css/Room.css';
import RoomMessages from './RoomMessages';
import RoomList from './RoomList';
// Components
import Messages from './Messages';
import ChatBoxGlobal from './ChatBoxGlobal';
import ChatMessageGlobal from './ChatMessageGlobal';
import Android from 'material-ui/svg-icons/action/android';

const selectSideActionsStyle = {
  margin: '1px',
  padding: '1px',
};

const messageStyle = {
  width: '100%',
  height: '100%',
}

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

const Room = ({ allRooms, handleJoinRoomAsBlack, handleJoinRoomAsWhite,
handleCreateRoomAsWhite, handleCreateRoomAsBlack, sendMessageGlobal,
messagesGlobal, sendMessageLocal, messagesLocal, thisUser, isWhite }) => (
  <div className="container">
    <h3>{`Welcome to Deep Red | Chess Master: ${thisUser}`}</h3>
    <div className="room-container">
      <div className="grid existing-room">
        <p className="title-text">Player vs Player</p>
          <RoomList className='room-list' allRooms={allRooms} handleJoinRoomAsBlack={handleJoinRoomAsBlack} handleJoinRoomAsWhite={handleJoinRoomAsWhite} />
        <tr>
          <td><img src={'/assets/user.png'} /></td>
          <td><img src={'/assets/user.png'} /></td>
        </tr>
        <tr>
          <td>
            <RaisedButton
              label="White"
              style={selectSideActionsStyle}
              secondary
              onTouchTap={() => handleCreateRoomAsWhite('default')}
            />
          </td>
          <td>
            <RaisedButton
              label="Black"
              style={selectSideActionsStyle}
              primary
              onTouchTap={() => handleCreateRoomAsBlack('default')}
            />
          </td>
        </tr>
      </div>

      <div className="grid player-vs-AI">
        <p>Player vs DeepRed</p>
        <tr>
          <td>
            <img src={'/assets/user.png'} />
          </td>
          <td>
            <img src={'/assets/android_logo.png'} />
          </td>
        </tr>
        <tr>
          <td>
            <RaisedButton
              label="White"
              style={selectSideActionsStyle}
              secondary
              onTouchTap={() => handleCreateRoomAsWhite('AI')}
            />
          </td>
          <td>
            <RaisedButton
              label="Black"
              style={selectSideActionsStyle}
              primary
              onTouchTap={() => handleCreateRoomAsBlack('AI')}
            />
          </td>
        </tr>
        <p>Play against Deep Red | Chess Master, a machine-learning chess computer and help her train to play even better</p>
      </div>
      <div className='grid AI-vs-AI'>
        <p>AI vs AI</p>
        <tr>
          <td>
            <img src={'/assets/android_logo.png'} />
          </td>
          <td>
           <img src={'/assets/android_logo.png'} />
          </td>
        </tr>
        <Link to="/ai">
          <RaisedButton
            label="Start"
            style={selectSideActionsStyle}
            secondary
            onTouchTap={() => handleCreateRoomAsWhite('default')}
          />
        </Link>
        <p>Watch Deep Red train and search for a new way to find a checkmate</p>
      </div>
      <div className="grid global-chat">
        <p className="title-text">Global Chat</p>
        <RoomMessages
          messagesGlobal={messagesGlobal}
          sendMessageGlobal={sendMessageGlobal}
          isWhite={isWhite}
          thisUser={thisUser}
        />
      </div>
    </div>
  </div>
);

export default Room;
