import React, { Component } from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import LinearProgress from 'material-ui/LinearProgress';
import { red700 } from 'material-ui/styles/colors';

import { showAIButton } from '../store/actions';

/**
 * A modal dialog can only be closed by selecting one of the actions.
 */
export default class AIDialog extends Component {

  handleClose() {
    const { dispatch } = this.props;
    dispatch(showAIButton());
  }

  render() {
    // const actions = [
    //   <FlatButton
    //     label="Cancel"
    //     primary={true}
    //     onTouchTap={this.handleClose}
    //   />,
    // ];
    return (
      <div>
        <Dialog
          title="DeepRed is playing games to discover a new checkmate..."
          modal
          open={this.props.shouldOpen}
        >
          <LinearProgress
            mode="indeterminate"
            color="#F44336"
          />
        </Dialog>
      </div>
    );
  }
}
