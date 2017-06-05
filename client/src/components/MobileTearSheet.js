const React = require('react');

const MobileTearSheet = React.createClass({

  propTypes: {
    height: React.PropTypes.number,
  },

  getDefaultProps() {
    return {
      height: '100%',
    };
  },

  render() {
    const styles = {
      root: {
        float: 'left',
        marginTop: '15vh',
        marginBottom: '15vh',
        marginRight: 24,
        width: '100%',
        fontSize: '0.5rem',
      },

      container: {
        border: 'solid 0px #d9d9d9',
        borderBottom: 'none',
        height: this.props.height,
        minHeight: '50vh',
        maxHeight: '50vh',
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

module.exports = MobileTearSheet;
