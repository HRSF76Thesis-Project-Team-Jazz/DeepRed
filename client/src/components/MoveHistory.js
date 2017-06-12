import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';
import MobileTearSheet from './MobileTearSheet';

class MoveHistory extends Component {

  componentDidMount() {
    document.getElementById('end-of-moves').scrollIntoView();
  }

  componentDidUpdate() {
    document.getElementById('end-of-moves').scrollIntoView();
  }

  render() {
    const { moveHistory } = this.props;

    return (
      <MobileTearSheet>
        <List>
          {moveHistory.map((move, i) => (
            <ListItem
              key={`${i}-${move}`}
              primaryText={`${i + 1}. ${move}`}
            />
          ))}
        </List>
        <div id="end-of-moves" />
      </MobileTearSheet>
    );
  }
}
export default MoveHistory;
