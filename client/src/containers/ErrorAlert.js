import React from 'react';
import { connect } from 'react-redux';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import { displayError, clearError } from '../store/actions';
/**
 * Dialog with action buttons. The actions are passed in as an array of React objects,
 * in this example [FlatButtons](/#/components/flat-button).
 *
 * You can also close this dialog by clicking outside the dialog, or with the 'Esc' key.
 */

class ErrorAlert extends React.Component {

  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
  }

  // handleOpen() {
  //   { dispatch } = this.props;
  //   dispatch(displayError({ open: true }));
  // }

  handleClose() {
    const { dispatch } = this.props;
    dispatch(clearError());
  }

  render() {
    const { error, open } = this.props;
    const actions = [
      <FlatButton
        label="OK"
        primary
        keyboardFocused
        onTouchTap={this.handleClose}
      />,
    ];
    return (
      <div>
        <RaisedButton label="Dialog" onTouchTap={this.handleOpen} />
        <Dialog
          title="Dialog With Actions"
          actions={actions}
          modal={false}
          open={open}
          onRequestClose={this.handleClose}
        >
          The actions in this window were passed in as an array of React objects.{error}
        </Dialog>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { moveState } = state;
  const { message, open, error } = moveState;
  return {
    message,
    open,
    error,
  };
}

export default connect(mapStateToProps)(ErrorAlert);
