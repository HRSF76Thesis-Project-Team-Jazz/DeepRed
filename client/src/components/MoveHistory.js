import React from 'react';
import uuidV4 from 'uuid/v4';
import { List, ListItem } from 'material-ui/List';
import MobileTearSheet from './MobileTearSheet';

const MoveHistory = ({ moveHistory }) => (
  <MobileTearSheet>
    <List>
      {moveHistory.map((move, i) => (
        <ListItem
          key={`${i}-${move}`}
          primaryText={`${i + 1}. ${move}`}
        />
      ))}
    </List>
  </MobileTearSheet>
);

export default MoveHistory;
