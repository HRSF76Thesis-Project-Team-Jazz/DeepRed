import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import RoomTearSheet from './RoomTearSheet';
import './css/Room.css';

const RoomList = ({ allRooms, handleJoinRoomAsWhite, handleJoinRoomAsBlack }) => (
  <RoomTearSheet>
    <div>
      {
        allRooms.map((room, i) => {
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
                        secondary
                        onTouchTap={() => handleJoinRoomAsWhite(room.count)}
                      />
                    </td>
                    <td>
                      <RaisedButton
                        label="Black"
                        disabled={room.playerB !== undefined}
                        primary
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
  </RoomTearSheet>

);

export default RoomList;