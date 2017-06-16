import React from 'react';
import { Link } from 'react-router-dom';
import RaisedButton from 'material-ui/RaisedButton';

import RoomMessages from './RoomMessages';
import RoomList from './RoomList';
import './css/Room.css';

const Room = ({ allRooms, handleJoinRoomAsBlack, handleJoinRoomAsWhite,
  handleCreateRoomAsWhite, handleCreateRoomAsBlack, sendMessageGlobal,
  messagesGlobal, thisUser, isWhite }) => (
    <div className="container">
      <div className="room-container">
        <table>
          <thead>
            <th className="table-col"><div className="title-text">Player vs. Player</div></th>
            <th className="table-col"><div className="title-text">Player vs. Deep Red</div></th>
            <th className="table-col"><div className="title-text">Deep Red vs. Deep Red</div></th>
            <th className="table-col"><div className="title-text">Global Chat</div></th>
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
                          onTouchTap={() => handleCreateRoomAsWhite('default')}
                        />
                      </td>
                      <td>
                        <RaisedButton
                          label="Black"
                          backgroundColor="#000000"
                          labelColor="#FFFFFF"
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
                        onTouchTap={() => handleCreateRoomAsWhite('AI')}
                      />
                    </td>
                    <td>
                      <RaisedButton
                        label="Black"
                        backgroundColor="#000000"
                        labelColor="#FFFFFF"
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
                          backgroundColor="#C62828"
                          labelColor="#FFFFFF"
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
                <div className="description">
                  Play against Deep Red, a machine-learning chess computer, and help it train to play even better
                </div>
              </td>
              <td className="deepred-text">
                <div className="description">
                  Watch Deep Red train and search for new ways to find a checkmate
                </div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    </div>
  );

export default Room;
