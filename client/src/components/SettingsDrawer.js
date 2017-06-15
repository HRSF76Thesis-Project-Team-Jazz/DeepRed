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
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';

import './css/SettingsDrawer.css';

class SettingsDrawer extends Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
    this.handleToggle = this.handleToggle.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handlePauseClose = this.handlePauseClose.bind(this);
    this.handleResumeClose = this.handleResumeClose.bind(this);
    this.handleSurrenderClose = this.handleSurrenderClose.bind(this);
    this.handleLobbyClose = this.handleLobbyClose.bind(this);
  }

  handleToggle() {
    this.setState({ open: !this.state.open });
  }

  handleClose() {
    this.setState({ open: false });
  }

  handlePauseClose() {
    this.handleClose();
    this.props.sendPauseRequest();
  }

  handleResumeClose() {
    this.handleClose();
    this.props.sendResumeRequest();
  }

  handleSurrenderClose() {
    this.handleClose();
    this.props.handleSurrender();
  }

  handleLobbyClose() {
    this.handleClose();
    this.props.handleLobbyOpen();
  }
  render() {
    return (
      <div>
        <RaisedButton
          label=""
          onTouchTap={this.handleToggle}
          icon={<NavigationMenu />}
          className="drawer-button"
        />
        <Drawer
          width={'18%'}
          docked={false}
          openSecondary
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <Link to="/ai">
            <MenuItem
              onTouchTap={this.handleClose}
              leftIcon={<SocialPerson />}
            >
              AI vs AI
            </MenuItem>
          </Link>
          <MenuItem
            onTouchTap={this.handlePauseClose}
            leftIcon={<SocialPerson />}
          >
            Pause
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleResumeClose}
            leftIcon={<SocialShare />}
          >
            Resume
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleSurrenderClose}
            leftIcon={<SocialShare />}
          >
            Surrender
          </MenuItem>
            <Link to="/">
            <MenuItem
              onTouchTap={this.handleLobbyClose}
              leftIcon={<NavigationClose />}
            >
              Lobby
            </MenuItem>
          </Link>
          <Link to="/login">
            <MenuItem
              onTouchTap={this.handleClose}
              leftIcon={<ActionExit />}
            >
              Logout
            </MenuItem>
          </Link>
        </Drawer>
      </div>
    );
  }
}

export default SettingsDrawer;
