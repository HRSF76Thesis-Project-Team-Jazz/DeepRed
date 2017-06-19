import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import { } from '../store/actions';

// Components
import './css/App.css';

const AboutPage = () => (
  <div>
    <img
      alt=""
      className="circular-pic"
      src="/assets/ryan.png"
    />
  </div>
);

export default AboutPage;
