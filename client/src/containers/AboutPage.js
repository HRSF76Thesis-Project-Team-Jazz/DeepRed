import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

// Components
import Header from '../components/Header';


import './css/AboutPage.css';

class AboutPage extends Component {
  constructor(props) {
    super(props);
  }









  render() {
    return (
      <div>
        <Header />
        <Paper className="about-paper" zDepth={4}>
          <div className="banner">
            <span>Meet the team!</span>
          </div>
          <table className="table-layout">
            <tbody>
              <tr>
                <td className="table-col">
                  <img
                    alt=""
                    id="carlo-pic"
                    className="circular-pic"
                    src="/assets/carlo.png"
                  />
                </td>
                <td className="table-col">
                  <img
                    alt=""
                    id="jason-pic"
                    className="circular-pic"
                    src="/assets/jason.png"
                  />
                </td>
                <td className="table-col">
                  <img
                    alt=""
                    id="ryan-pic"
                    className="circular-pic"
                    src="/assets/ryan.png"
                  />
                </td>
                <td className="table-col">
                  <img
                    alt=""
                    id="shawn-pic"
                    className="circular-pic"
                    src="/assets/shawn.png"
                  />
                </td>
              </tr>
              <tr>
                <td className="name-title">
                  <span>Carlo P. Las Marias</span>
                </td>
                <td className="name-title">
                  <span>Jason Yu</span>
                </td>
                <td className="name-title">
                  <span>Ryan Chow</span>
                </td>
                <td className="name-title">
                  <span>Shawn Feng</span>
                </td>
              </tr>
              <tr>
                <td className="name-title">
                  <span>Developer</span>
                </td>
                <td className="name-title">
                  <span>Developer</span>
                </td>
                <td className="name-title">
                  <span>Developer</span>
                </td>
                <td className="name-title">
                  <span>Developer</span>
                </td>
              </tr>
            </tbody>
          </table>
        </Paper>
      </div>
    );
  }
}

export default AboutPage;
