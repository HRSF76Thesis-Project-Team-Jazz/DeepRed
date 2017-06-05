import React from 'react';
import uuidV4 from 'uuid/v4';
import { List, ListItem } from 'material-ui/List';
import MobileTearSheet from './MobileTearSheet';

const MoveHistory = ({ moveHistory }) => (
  <MobileTearSheet>
    <List>
      {moveHistory.map((move, i) => (
        <ListItem
          key={`${uuidV4}-${move.from}-${move.to}`}
          primaryText={`${(i < 9) ? ` ${i + 1}` : `${i + 1}`}. ${move.from}${(move.capturedPiece) ? ' x ' : ' - '}${move.to}`}
        />
      ))}
    </List>
  </MobileTearSheet>
);

export default MoveHistory;
