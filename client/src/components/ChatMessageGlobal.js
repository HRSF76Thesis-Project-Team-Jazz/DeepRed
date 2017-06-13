import React from 'react';
import './css/ChatMessage.css';

const lightColors = ['EDE7F6', 'B39DDB', 'E1BEE7', 'E3F2FD', 'C5CAE9', '64B5F6', 'E8F5E9', 'E0F2F1', '26A69A', 'FFF8E1', 'FFF9C4', 'FFCCBC', 'FFE0B2', 'BCAAA4', 'EEEEEE', '890A4AE'];

const darkColors = ['9575CD', '512DA8', '9C27B0', '3949AB', '1565C0', '004D40'];

const colorCount = lightColors.length + darkColors.length;

const getColor = (string) => {
  const darkFont = '383838';
  let fontColor = 'FFFFFF';

  let total = 0;
  for (let i = 0; i < string.length; i += 1) {
    total += string[i].charCodeAt();
  }

  const selection = total % colorCount;
  if (selection < lightColors.length) fontColor = darkFont;
  const selectedColor = (selection < lightColors.length) ?
    lightColors[selection] : darkColors[selection - darkColors.length];

  return {
    backgroundColor: `#${selectedColor}`,
    color: `#${fontColor}`,
  };
};

const ChatMessageGlobal = ({ user, isThisUser, color, message, timeStamp }) => (
  <div>
    <div className="chat-timeStamp">{timeStamp}</div>
    <div
      className={(isThisUser && color === 'W') ? 'chat-message-container white-chat' : (isThisUser && color === 'B') ? 'chat-message-container black-chat' : (color === 'red') ? 'chat-message-container red-chat' : 'chat-message-container'}

      style={(!isThisUser && color !== 'red') ?
        getColor(user) : {}}
    >

      <span className="chat-username">{user}: </span><span className="chat-message">{message}</span>
    </div>
  </div>
);

export default ChatMessageGlobal;
