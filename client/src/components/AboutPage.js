import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import { SocialIcon } from 'react-social-icons';

import Header from './Header';

import './css/AboutPage.css';

class AboutPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      carlo: 1,
      jason: 1,
      ryan: 1,
      shawn: 1,
    };

    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
  }

  onMouseEnter(name) {
    const nameState = {};
    nameState[name] = 2;
    this.setState(nameState);
  }

  onMouseLeave(name) {
    const nameState = {};
    nameState[name] = 1;
    this.setState(nameState);
  }

  render() {
    return (
      <div>
        <Header className="header-top" />
        <Paper className="about-paper" zDepth={4}>
          <hr className="horizontal-line" />
          <div className="meet-the-team">
            <div className="banner">
              <span>Team Deep Red</span>
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
                      src={`/assets/carlo${this.state.carlo}.jpg`}
                      onMouseEnter={() => this.onMouseEnter('carlo')}
                      onMouseLeave={() => this.onMouseLeave('carlo')}
                    />
                  </td>
                  <td className="table-col">
                    <img
                      alt=""
                      id="jason-pic"
                      className="circular-pic"
                      src={`/assets/jason${this.state.jason}.jpg`}
                      onMouseEnter={() => this.onMouseEnter('jason')}
                      onMouseLeave={() => this.onMouseLeave('jason')}
                    />
                  </td>
                  <td className="table-col">
                    <img
                      alt=""
                      id="ryan-pic"
                      className="circular-pic"
                      src={`/assets/ryan${this.state.ryan}.jpg`}
                      onMouseEnter={() => this.onMouseEnter('ryan')}
                      onMouseLeave={() => this.onMouseLeave('ryan')}
                    />
                  </td>
                  <td className="table-col">
                    <img
                      alt=""
                      id="shawn-pic"
                      className="circular-pic"
                      src={`/assets/shawn${this.state.shawn}.jpg`}
                      onMouseEnter={() => this.onMouseEnter('shawn')}
                      onMouseLeave={() => this.onMouseLeave('shawn')}
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
                    <span className="role">Full Stack Software Engineer</span>
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
                    <span className="social-icon"><SocialIcon className="icon-size" network="linkedin" url="https://www.linkedin.com/in/carlolm/" /></span>
                    <span className="social-icon">
                      <SocialIcon
                        color="#B71C1C"
                        network="email"
                        url="mailto:carlolm@gmail.com?subject=Comments about DeepRed"
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
                  src="/assets/team-deepred1.jpg"
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
                  src="/assets/team-deepred2.jpg"
                />
                <div>
                  <span className="name">Team tapout at Airbnb headquarters</span>
                </div>
              </div>
              <div className="spacer-box" />
              <div className="group-picture-item">
                <img
                  alt=""
                  className="group-pic"
                  src="/assets/team-deepred3.jpg"
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
