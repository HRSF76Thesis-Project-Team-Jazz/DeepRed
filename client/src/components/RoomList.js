import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import RoomTearSheet from './RoomTearSheet';


const RoomList = ({allRooms, handleJoinRoomAsWhite, handleJoinRoomAsBlack }) => (
      <RoomTearSheet>
        <div>
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
          </div>
        </RoomTearSheet>

);

export default RoomList;