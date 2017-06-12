import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import './css/Room.css';

const selectSideActionsStyle = {
  margin: '1px',
  padding: '1px',
};

const Room = ({ allRooms, handleJoinRoomAsBlack, handleJoinRoomAsWhite,
handleCreateRoomAsWhite, handleCreateRoomAsBlack, thisUser }) => (
  <div className="room-container">
    <h3>{`Welcome to Deep Red | Chess Master: ${thisUser}`}</h3>
    <p>Player vs Player</p>
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
    <p>Existing rooms: </p>
    <tbody>
      {
        allRooms.map((room) => {
          if (room !== null) {
            return (
              <tr>
                <th>
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
                <th>
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
                <th>
                  {room.playerB}
                </th>
              </tr>
            );
          }
        })
      }
    </tbody>
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
  </div>
);

export default Room;

// <RaisedButton
//  className="create-room-button"
//  label="Create new room"
//  primary
//  onTouchTap={createNewPVPRoom}
// />
