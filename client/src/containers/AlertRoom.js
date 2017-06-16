import React from 'react';
import Dialog from 'material-ui/Dialog';
import Room from '../components/Room';
import '../components/css/Room.css';
import './css/App.css';

/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */
// const customContentStyle = {
//   width: '25%',
//   maxWidth: 'none',
// };
const customContentStyle = {
  width: '82%',
  maxWidth: 'none',
  // maxHeight: 'none',
  height: '100%',
  opacity: 0.85,
  paddingTop: '0vw',
  paddingRight: '0vw',
  paddingBottom: '0vw',
  paddingLeft: '0vw',
};

const AlertRoom = ({ title, open, actions, handleClose, showRooms,
allRooms, createNewPVPRoom, handleJoinRoomAsBlack, handleJoinRoomAsWhite,
handleCreateRoomAsWhite, handleCreateRoomAsBlack, thisUser, persist,
messagesGlobal, sendMessageGlobal, sendMessageLocal, messagesLocal, isWhite }) => (
  <div>
    <Dialog
      title={showRooms === true ?
        <div className="room-title">{'Welcome to '}
          <span className="deep-red">{'Deep Red'}</span>
          {`, ${thisUser}`}
        </div>
        : title}
      contentStyle={thisUser ? customContentStyle : null}
      autoScrollBodyContent
      autoDetectWindowHeight
      children={
        <Room
          thisUser={thisUser}
          allRooms={allRooms}
          createNewPVPRoom={createNewPVPRoom}
          handleJoinRoomAsBlack={handleJoinRoomAsBlack}
          handleJoinRoomAsWhite={handleJoinRoomAsWhite}
          handleCreateRoomAsWhite={handleCreateRoomAsWhite}
          handleCreateRoomAsBlack={handleCreateRoomAsBlack}
          sendMessageGlobal={sendMessageGlobal}
          sendMessageLocal={sendMessageLocal}
          messagesGlobal={messagesGlobal}
          messagesLocal={messagesLocal}
          isWhite={isWhite}

        />
      }
      actions={actions}
      modal={persist === true ? persist : false}
      open={open}
      onRequestClose={handleClose}
      actionsContainerClassName="test"
      bodyClassName="test"
      className="test"
      contentClassName="test"
      overlayClassName="test"
      titleClassName="test"

    />
  </div>
);

export default AlertRoom;
