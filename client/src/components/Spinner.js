import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import './css/Spinner.css';

const Spinner = () => (
  <div>
    <CircularProgress 
      className="ai-spinner"
      size={80}
      thickness={7}
    />
  </div>
);

export default Spinner;