import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import ActionHome from 'material-ui/svg-icons/action/home';
import ActionExit from 'material-ui/svg-icons/action/exit-to-app';
import Android from 'material-ui/svg-icons/action/android';
import Pause from 'material-ui/svg-icons/av/pause';
import PlayArrow from 'material-ui/svg-icons/av/play-arrow';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import NavigationMenu from 'material-ui/svg-icons/navigation/menu';
import Group from 'material-ui/svg-icons/social/group';
import Done from 'material-ui/svg-icons/action/done';

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
    window.location = '/';
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
          className="drawer"
          width={'18%'}
          docked={false}
          openSecondary
          open={this.state.open}
          onRequestChange={open => this.setState({ open })}
        >
          <MenuItem
            onTouchTap={this.handlePauseClose}
            leftIcon={<Pause />}
          >
            Pause
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleResumeClose}
            leftIcon={<PlayArrow />}
          >
            Resume
          </MenuItem>
          <MenuItem
            onTouchTap={this.handleSurrenderClose}
            leftIcon={<NavigationClose />}
          >
            Surrender
          </MenuItem>
          <Link to="/">
            <MenuItem
              onTouchTap={this.handleLobbyClose}
              leftIcon={<ActionHome />}
            >
              Lobby
            </MenuItem>
          </Link>
          <Link to="/ai">
            <MenuItem
              onTouchTap={this.handleClose}
              leftIcon={<Android />}
            >
              AI vs AI
            </MenuItem>
          </Link>
          <Link to="/victories">
            <MenuItem
              onTouchTap={this.handleClose}
              leftIcon={<Done />}
            >
              Victories
            </MenuItem>
          </Link>
          <Link to="/about">
            <MenuItem
              onTouchTap={this.handleClose}
              leftIcon={<Group />}
            >
              About
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
