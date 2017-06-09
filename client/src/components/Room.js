import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import './css/Room.css';


const Room = ({ allRooms, createNewPVPRoom, handleJoinRoomAsBlack, handleJoinRoomAsWhite }) => (
  <div className="room-container">
    <p className="dialog-box-title">Choose or create a room to join!</p>
    <RaisedButton
      className="create-room-button"
      label="Create new room"
      primary
      onTouchTap={createNewPVPRoom}
    />
    <p className="dialog-box-title">Existing rooms: </p>
    <tbody>
      {
        allRooms.map((room) => {
          return (
            <tr>
              <th>
                {room.room}
              </th>
              <th>
                <RaisedButton
                  label="White"
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
                  primary
                  onTouchTap={() => handleJoinRoomAsBlack(room.count)}
                />
              </th>
              <th>
                {room.playerB}
              </th>
            </tr>
          );
        })
      }
    </tbody>
  </div>
);

export default Room;

