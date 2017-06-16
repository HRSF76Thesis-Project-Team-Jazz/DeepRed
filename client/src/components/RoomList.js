import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import './css/Room.css';

const RoomList = ({ allRooms, handleJoinRoomAsWhite, handleJoinRoomAsBlack }) => (
  <div className="room-list">
    {
      allRooms.map((room) => {
        if (room !== null) {
          return (
            <table className="room-listing">
              <thead>
                <th className="room-name" colSpan="2">
                  {room.room[0].toUpperCase() + room.room.substring(1)}
                </th>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <RaisedButton
                      label="White"
                      disabled={room.playerW !== undefined}
                      onTouchTap={() => handleJoinRoomAsWhite(room.count)}
                    />
                  </td>
                  <td>
                    <RaisedButton
                      label="Black"
                      disabled={room.playerB !== undefined}
                      backgroundColor="#000000"
                      labelColor="#FFFFFF"
                      onTouchTap={() => handleJoinRoomAsBlack(room.count)}
                    />
                  </td>
                </tr>
                <tr>
                  <td className="player-name">{room.playerW}</td>
                  <td className="player-name">{room.playerB}</td>
                </tr>
              </tbody>
            </table>

          );
        }
      })
    }
  </div>
);

export default RoomList;
