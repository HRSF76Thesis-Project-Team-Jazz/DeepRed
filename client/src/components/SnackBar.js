import React, { Component } from 'react';
import { connect } from 'react-redux';
import Snackbar from 'material-ui/Snackbar';
import RaisedButton from 'material-ui/RaisedButton';

import { turnSnackbarOff } from '../store/actions';
 
 class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.handleRequestClose = this.handleRequestClose.bind(this);
  }

  handleRequestClose() {
    const { dispatch, snackbarOpen } = this.props;
    dispatch(turnSnackbarOff());
  }

  render() {
    const { snackbarOpen } = this.props;
    return (
      <div>
        <Snackbar
          open={snackbarOpen}
          message="Check!!"
          autoHideDuration={3000}
          onRequestClose={this.handleRequestClose}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { controlState} = state;
  const {
    snackbarOpen,
  } = controlState;
  return {
    snackbarOpen,
  };
}

export default connect(mapStateToProps)(SnackBar);