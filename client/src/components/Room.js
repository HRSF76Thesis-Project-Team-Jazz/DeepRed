import React from 'react';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';
import './css/Room.css';
import RoomMessages from './RoomMessages';
import RoomList from './RoomList';

const selectSideActionsStyle = {
  margin: '1px',
  padding: '1px',
};

const Room = ({ allRooms, handleJoinRoomAsBlack, handleJoinRoomAsWhite,
  handleCreateRoomAsWhite, handleCreateRoomAsBlack, sendMessageGlobal,
  messagesGlobal, thisUser, isWhite }) => (
    <div className="container">
      <h3>{`Welcome to Deep Red | Chess Master: ${thisUser}`}</h3>
      <div className="room-container">

        <table>
          <thead>
            <th className="table-col"><p className="title-text">Player vs Player</p></th>
            <th className="table-col"><p className="title-text">Player vs DeepRed</p></th>
            <th className="table-col"><p className="title-text">Deep Red vs. Deep Red</p></th>
            <th className="table-col"><p className="title-text">Global Chat</p></th>
          </thead>
          <tbody>
            <tr>
              <td>

                <table className="icon-button">
                  <tbody>
                    <tr>
                      <td className="td-icon" ><img className="icon" src={'/assets/playerW.png'} alt="player-white" /></td>
                      <td className="td-icon"><img className="icon" src={'/assets/playerB.png'} alt="player-black" /></td>
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
                  </tbody>
                </table>

              </td>
              <td>

                <table className="icon-button">
                  <tr>
                    <td className="td-icon">
                      <img className="icon" src={'/assets/player.png'} alt="player" />
                    </td>
                    <td className="td-icon">
                      <img className="icon" src={'/assets/computer.png'} alt="computer" />
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
                </table>

              </td>
              <td>

                <table className="icon-button">
                  <tr>
                    <td className="td-icon">
                      <img className="icon" src={'/assets/computer.png'} alt="computer" />
                    </td>
                    <td className="td-icon">
                      <img className="icon" src={'/assets/computer.png'} alt="computer" />
                    </td>
                  </tr>
                  <tr>
                    <td colSpan="2" className="start-ai">
                      <Link to="/ai">
                        <RaisedButton
                          label="Start"
                          style={selectSideActionsStyle}
                          secondary
                          onTouchTap={() => handleCreateRoomAsWhite('default')}
                        />
                      </Link>
                    </td>
                  </tr>
                </table>

              </td>
              <td rowSpan="2">
                <RoomMessages
                  messagesGlobal={messagesGlobal}
                  sendMessageGlobal={sendMessageGlobal}
                  isWhite={isWhite}
                  thisUser={thisUser}
                />
              </td>
            </tr>

            <tr>
              <td>
                <RoomList
                  className="room-list"
                  allRooms={allRooms}
                  handleJoinRoomAsBlack={handleJoinRoomAsBlack}
                  handleJoinRoomAsWhite={handleJoinRoomAsWhite}
                />
              </td>
              <td className="deepred-text">
                <p>Play against Deep Red, a machine-learning chess computer, and help it train to play even better</p>
              </td>
              <td className="deepred-text">
                <p>Watch Deep Red train and search for new ways to find a checkmate</p>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );

export default Room;
