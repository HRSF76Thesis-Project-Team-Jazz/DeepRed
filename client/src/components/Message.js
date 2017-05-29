import React from 'react';

import './css/Message.css';

const Message = ({ message }) => {
  return (
    <div className="board-message">
      {message}
    </div>
  );
};

export default Message;
