import React, { Component } from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SocialPerson from 'material-ui/svg-icons/social/person';
import SocialShare from 'material-ui/svg-icons/social/share';
import ContentSave from 'material-ui/svg-icons/content/save';
import ActionExit from 'material-ui/svg-icons/action/exit-to-app';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import NavigationClose from 'material-ui/svg-icons/navigation/close';

class SettingsDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  handleClose() {
    this.setState({ open: false });
  }

  render() {
    return (
      <div>
        <RaisedButton
          label="Settings"
          onTouchTap={this.handleToggle}
        />
        <Drawer
          width={'30%'}
          openSecondary
          docked={false}
          open={this.state.open}
        >
          <MenuItem onTouchTap={this.handleClose} leftIcon={<SocialPerson />}>User Profile</MenuItem>
          <MenuItem onTouchTap={this.handleClose} leftIcon={<ContentSave />}>Save Game</MenuItem>
          <MenuItem onTouchTap={this.handleClose} leftIcon={<NavigationArrowUpward />}>Load Game</MenuItem>
          <MenuItem onTouchTap={this.handleClose} leftIcon={<NavigationClose />}>Quit Game</MenuItem>
          <MenuItem onTouchTap={this.handleClose} leftIcon={<SocialShare />}>Share</MenuItem>
          <MenuItem onTouchTap={this.handleClose} leftIcon={<ActionExit />}>Logout</MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default SettingsDrawer;
