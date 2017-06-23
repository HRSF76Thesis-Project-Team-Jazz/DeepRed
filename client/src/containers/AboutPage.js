import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import { SocialIcon } from 'react-social-icons';

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
        <Header className="header" />
        <Paper className="about-paper" zDepth={4}>
          <div className="about-us">
            <div className="banner">
              <span>About Us</span>
            </div>
          </div>
          <hr className="horizontal-line" />
          <div className="meet-the-team">
            <div className="banner">
              <span>Meet The Team</span>
            </div>
            <div className="spacer-box" />
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
                <tr className="spacer">
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                </tr>
                <tr>
                  <td className="name-title">
                    <span className="name">Carlo P. Las Marias</span>
                  </td>
                  <td className="name-title">
                    <span className="name">Jason Yu</span>
                  </td>
                  <td className="name-title">
                    <span className="name">Ryan Chow</span>
                  </td>
                  <td className="name-title">
                    <span className="name">Shawn Feng</span>
                  </td>
                </tr>
                <tr>
                  <td className="name-title">
                    <span className="role">Senior Software Engineer</span>
                  </td>
                  <td className="name-title">
                    <span className="role">Back End Engineer</span>
                  </td>
                  <td className="name-title">
                    <span className="role">Front End Engineer</span>
                  </td>
                  <td className="name-title">
                    <span className="role">Solutions Architect</span>
                  </td>
                </tr>
                <tr className="spacer">
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                </tr>
                <tr className="social-bar">
                  <td className="social-link ">
                    <span className="social-icon"><SocialIcon network="linkedin" url="https://www.linkedin.com/in/carlolm/" /></span>
                    <span className="social-icon">
                      <SocialIcon
                        color="#B71C1C"
                        network="email"
                        url="mailto:carlom@gmail.com?subject=Comments about DeepRed"
                      />
                    </span>
                  </td>
                  <td className="social-link ">
                    <span className="social-icon"><SocialIcon network="linkedin" url="https://www.linkedin.com/in/jason-yu/" /></span>
                    <span className="social-icon">
                      <SocialIcon
                        color="#B71C1C"
                        network="email"
                        url="mailto:jason.yu014@gmail.com?subject=Comments about DeepRed"
                      />
                    </span>
                  </td>
                  <td className="social-link ">
                    <span className="social-icon"><SocialIcon network="linkedin" url="https://www.linkedin.com/in/ryanmchow/" /></span>
                    <span className="social-icon">
                      <SocialIcon
                        color="#B71C1C"
                        network="email"
                        url="mailto:chowryan@gmail.com?subject=Comments about DeepRed"
                      />
                    </span>
                  </td>
                  <td className="social-link ">
                    <span className="social-icon"><SocialIcon network="linkedin" url="https://www.linkedin.com/in/shawnshifeng/" /></span>
                    <span className="social-icon">
                      <SocialIcon
                        color="#B71C1C"
                        network="email"
                        url="mailto:shawnsfeng@gmail.com?subject=Comments about DeepRed"
                      />
                    </span>
                  </td>
                </tr>
                <tr className="spacer">
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                  <td className="spacer-item" />
                </tr>
              </tbody>
            </table>
            <div className="spacer-box" />
            <div className="group-picture">
              <div className="group-picture-item">
                <img
                  alt=""
                  className="group-pic"
                  src="/assets/group-pic1.png"
                />
                <div>
                  <span className="name">Old hacking days</span>
                </div>
              </div>
              <div className="spacer-box" />
              <div className="group-picture-item">
                <img
                  alt=""
                  className="group-pic"
                  src="/assets/group-pic2.jpeg"
                />
                <div>
                  <span className="name">Team tapout at Airbnb headquarter</span>
                </div>
              </div>
              <div className="spacer-box" />
              <div className="group-picture-item">
                <img
                  alt=""
                  className="group-pic"
                  src="/assets/group-pic3.jpg"
                />
                <div>
                  <span className="name">Celebration after DeepRed presentation</span>
                </div>
              </div>
              <div className="spacer-box" />
              <div className="spacer-box" />
            </div>
          </div>
        </Paper>
      </div>
    );
  }
}

export default AboutPage;
