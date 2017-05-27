import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import SocialPerson from 'material-ui/svg-icons/social/person';
import SocialShare from 'material-ui/svg-icons/social/share';
import ContentSave from 'material-ui/svg-icons/content/save';
import ActionExit from 'material-ui/svg-icons/action/exit-to-app';
import NavigationArrowUpward from 'material-ui/svg-icons/navigation/arrow-upward';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ActionSettings from 'material-ui/svg-icons/action/settings';

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
          label=""
          onTouchTap={this.handleToggle}
          icon={<ActionSettings />}
        />
        <Drawer
          width={'30%'}
          openSecondary
          docked={false}
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <Link to="/settings">
            <MenuItem
              onTouchTap={this.handleClose}
              leftIcon={<SocialPerson />}
            >
              User Profile
            </MenuItem>
          </Link>
          <MenuItem
            onTouchTap={this.handleClose}
            leftIcon={<ContentSave />}
          >
            Save Game
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleClose}
            leftIcon={<NavigationArrowUpward />}
          >
            Load Game
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleClose}
            leftIcon={<NavigationClose />}
          >
            Quit Game
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleClose}
            leftIcon={<SocialShare />}
          >
            Share
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleClose}
            leftIcon={<ActionExit />}
          >
            Logout
          </MenuItem>
        </Drawer>
      </div>
    );
  }
}

export default SettingsDrawer;
