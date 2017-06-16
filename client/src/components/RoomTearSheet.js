const React = require('react');

const RoomTearSheet = React.createClass({

  propTypes: {
    height: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      height: 500,
    };
  },

  render() {
    const styles = {
      root: {
        // float: 'left',
        // marginTop: '0vw',
        // // marginBottom: '10vw',
        // marginRight: 24,
        width: '100%',
        fontSize: '0.5rem',
      },

      container: {
        // border: 'solid 0px #d9d9d9',
        // borderBottom: 'none',
        // height: '37vw',
        minHeight: '18vw',
        maxHeight: '18vw',
        overflow: 'auto',
      },

    };

    return (
      <div style={styles.root}>
        <div style={styles.container}>
          {this.props.children}
        </div>
      </div>
    );
  },

});

module.exports = RoomTearSheet;
