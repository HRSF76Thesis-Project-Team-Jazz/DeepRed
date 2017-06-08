import React from 'react';
import Dialog from 'material-ui/Dialog';
import Room from '../components/Room';
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

const Alert = ({ title, open, actions, handleClose, showRooms, allRooms, createNewPVPRoom }) => (
  <div>
    <Dialog
      title={showRooms === true ?
        <Room allRooms={allRooms} createNewPVPRoom={createNewPVPRoom} />
        : title}
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={handleClose}
    />
  </div>
);

export default Alert;
