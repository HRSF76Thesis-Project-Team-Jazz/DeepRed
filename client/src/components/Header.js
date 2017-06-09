import React from 'react';
import SettingsDrawer from '../components/SettingsDrawer';

import './css/Header.css';

const Header = ({ sendPauseRequest, onSurrander }) => (
  <div className="header">
    <table>
      <tbody>
        <tr>
          <td><img className="banner-img" src={'/assets/deepRed-dark-bg.png'} alt={''} /></td>
          <td className="button-cell">
            <SettingsDrawer
              sendPauseRequest={sendPauseRequest}
              onSurrander={onSurrander}
            />
            <a href="/profile" className="button">Home</a>
            <a href="/logout" className="button">Logout</a>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Header;
