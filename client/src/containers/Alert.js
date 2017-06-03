import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
// import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { clearError } from '../store/actions';
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

const Alert = ({ title, open, actions, handleClose }) => (
  <div>
    <Dialog
      title={title}
      actions={actions}
      modal={false}
      open={open}
      onRequestClose={handleClose}
    />
  </div>
);

export default Alert;
