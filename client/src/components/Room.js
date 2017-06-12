import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import './css/Room.css';

const selectSideActionsStyle = {
  margin: '1px',
  padding: '1px',
};

const style = {
  height: 100,
  width: 100,
  margin: 20,
  textAlign: 'center',
  display: 'inline-block',
};

const Room = ({ allRooms, handleJoinRoomAsBlack, handleJoinRoomAsWhite,
handleCreateRoomAsWhite, handleCreateRoomAsBlack, thisUser }) => (
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
        <RaisedButton
          label="Start"
          style={selectSideActionsStyle}
          secondary
          onTouchTap={() => handleCreateRoomAsWhite('default')}
        />
      </div>
      <div className="grid existing-room">
      <p className="title-text">Existing rooms </p>
        <tbody>
          {
            allRooms.map((room) => {
              if (room !== null) {
                return (
                  <tr>
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
      </div>
      <div className="grid">
        <p className="title-text">Global Chat</p>
      </div> 
    </div>
  </div>
);

export default Room;

// <RaisedButton
//  className="create-room-button"
//  label="Create new room"
//  primary
//  onTouchTap={createNewPVPRoom}
// />
