import React from 'react';
import { List, ListItem } from 'material-ui/List';

import MobileTearSheet from './MobileTearSheet';

const MoveHistory = () => {
  const moveList = [];
  for (let i = 0; i < 40; i += 1) {
    moveList.push('e2 - e4');
  }
  return (
    <MobileTearSheet>
      <List>
        { moveList.map((move, i) => ((i < 9) ? <ListItem primaryText={`_${i + 1}. ${move}`} /> : <ListItem primaryText={`${i + 1}. ${move}`} />))}
      </List>
    </MobileTearSheet>
  );
};

export default MoveHistory;
