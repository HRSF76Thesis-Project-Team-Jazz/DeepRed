import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import './css/Room.css';


const Room = ({ allRooms, createNewPVPRoom }) => (
  <div className="room-container">
    <p className="dialog-box-title">Choose or create a room to join!</p>
    <RaisedButton
      className="create-room-button"
      label="Create new room"
      primary
      onTouchTap={createNewPVPRoom}
    />
    <p className="dialog-box-title">Existing rooms: </p>
    <div>
      <table>
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
                  />
                </th>
                <th>
                  <RaisedButton
                    label="Black"
                    primary
                  />
                </th>
              </tr>
            );
          })
        }
      </table>
    </div>
  </div>
);

export default Room;

