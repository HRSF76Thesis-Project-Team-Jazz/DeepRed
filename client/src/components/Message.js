import React from 'react';
import './css/Message.css';

const Message = ({ message }) => (
  <div className="board-message">
    {message}
  </div>
);

export default Message;
