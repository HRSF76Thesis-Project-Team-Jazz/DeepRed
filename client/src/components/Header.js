import React from 'react';
import SettingsDrawer from '../components/SettingsDrawer';

import './css/Header.css';

const Header = ({ sendPauseRequest, sendResumeRequest, handleSurrender, handleLobbyOpen }) => (
  <div className="header">
    <table>
      <tbody>
        <tr>
          <td />
          <td><img className="banner-img" src={'/assets/deepRed-dark-bg.png'} alt={''} /></td>
          <td className="button-cell">
            <SettingsDrawer
              sendResumeRequest={sendResumeRequest}
              sendPauseRequest={sendPauseRequest}
              handleSurrender={handleSurrender}
              handleLobbyOpen={handleLobbyOpen}
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
);

export default Header;
