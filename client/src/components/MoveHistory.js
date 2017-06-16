import React, { Component } from 'react';
import { List, ListItem } from 'material-ui/List';

import './css/MoveHistory.css';

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
      <div className="move-history-list">
        <List style={{ padding: 0 }}>
          {moveHistory.map((move, i) => (
            <ListItem
              style={{ padding: 0, margin: 0, fontSize: '1vw' }}
              key={`${i}-${move}`}
              primaryText={`${i + 1}. ${move}`}
            />
          ))}
        </List>
        <div id="end-of-moves" />
      </div>
    );
  }
}
export default MoveHistory;
