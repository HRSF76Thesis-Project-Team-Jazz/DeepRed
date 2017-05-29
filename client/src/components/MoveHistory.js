import React from 'react';
import { connect } from 'react-redux';
import { List, ListItem } from 'material-ui/List';

import MobileTearSheet from './MobileTearSheet';

const MoveHistory = ({ moveHistory }) => {
  return (
    <MobileTearSheet>
      <List>
        {moveHistory.map((move, i) => (
          <ListItem
            key={`${i}-${move.from}-${move.to}`}
            primaryText={`${(i < 9) ? `_${i + 1}` : i + 1}. ${move.from}-${move.to}`}
          />
        ))}
      </List>
    </MobileTearSheet>
  );
};

function mapStateToProps(state) {
  const { gameState } = state;
  const { moveHistory } = gameState;
  return {
    moveHistory,
  };
}

export default connect(mapStateToProps)(MoveHistory);
