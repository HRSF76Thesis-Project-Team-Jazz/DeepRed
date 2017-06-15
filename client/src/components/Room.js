import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Messages from './Messages';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import './css/Room.css';
import MobileTearSheet from './MobileTearSheet';
import ChatBoxGlobal from './ChatBoxGlobal';
import ChatMessageGlobal from './ChatMessageGlobal';

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
      <div className="control-box">
        <p className="title-text">Player vs Player</p>
        <RaisedButton
          label="White"
          style={selectSideActionsStyle}
          secondary
          onTouchTap={() => handleCreateRoomAsWhite('default')}
        />
        <RaisedButton
          label="Black"
          style={selectSideActionsStyle}
          primary
          onTouchTap={() => handleCreateRoomAsBlack('default')}
        />
        <p>Player vs DeepRed</p>
        <RaisedButton
          label="White"
          style={selectSideActionsStyle}
          secondary
          onTouchTap={() => handleCreateRoomAsWhite('AI')}
        />
        <RaisedButton
          label="Black"
          style={selectSideActionsStyle}
          primary
          onTouchTap={() => handleCreateRoomAsBlack('AI')}
        />
        <p>AI vs AI</p>
        <Link to="/ai">
          <RaisedButton
            label="Start"
            style={selectSideActionsStyle}
            secondary
            onTouchTap={() => handleCreateRoomAsWhite('default')}
          />
        </Link>
      </div>
      <div className="grid existing-room">
      <p className="title-text">Existing rooms </p>
      <table>
        <tbody>
          {
            allRooms.map((room, i) => {
              if (room !== null) {
                return (
                  <tr key={i}>
                    <th className="room-name">
                      {room.room}
                    </th>
                    <th>
                      <RaisedButton
                        label="White"
                        disabled={room.playerW !== undefined}
                        secondary
                        onTouchTap={() => handleJoinRoomAsWhite(room.count)}
                      />
                    </th>
                    <th className="room-name">
                      {room.playerW}
                    </th>
                    <th>
                      <RaisedButton
                        label="Black"
                        disabled={room.playerB !== undefined}
                        primary
                        onTouchTap={() => handleJoinRoomAsBlack(room.count)}
                      />
                    </th>
                    <th className="room-name">
                      {room.playerB}
                    </th>
                  </tr>
                );
              }
            })
          }
        </tbody>
      </table>
      </div>
      <div className="grid">
        <p className="title-text">Global Chat</p>
        {/*<Messages
          style={messageStyle}
          messagesLocal={messagesLocal}
          sendMessageLocal={sendMessageLocal}
          messagesGlobal={messagesGlobal}
          sendMessageGlobal={sendMessageGlobal}
          isWhite={isWhite}
          thisUser={thisUser}
        />*/}
          <MobileTearSheet>
            {messagesGlobal.map((msg, i) => (
              <ChatMessageGlobal
                key={i + msg}
                isThisUser={msg.user === thisUser}
                color={msg.color}
                user={msg.user}
                message={msg.message}
                timeStamp={msg.timeStamp}
              />
            ))}
          </MobileTearSheet>
          <ChatBoxGlobal sendMessageGlobal={sendMessageGlobal} isWhite={isWhite} thisUser={thisUser} />
      </div>
    </div>
  </div>
);

export default Room;
