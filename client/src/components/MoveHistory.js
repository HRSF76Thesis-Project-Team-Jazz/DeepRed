import React from 'react';
import { List, ListItem } from 'material-ui/List';
// import ActionGrade from 'material-ui/svg-icons/action/grade';
// import ContentInbox from 'material-ui/svg-icons/content/inbox';
// import ContentSend from 'material-ui/svg-icons/content/send';
// import ContentDrafts from 'material-ui/svg-icons/content/drafts';
// import Divider from 'material-ui/Divider';
// import ActionInfo from 'material-ui/svg-icons/action/info';

import MobileTearSheet from './MobileTearSheet';

const MoveHistory = () => {
  const moveList = [];
  for (let i = 0; i < 40; i += 1) {
    moveList.push('Chess Move');
  }
  return (
    <MobileTearSheet>
      <List>
        { moveList.map((move, i) => ((i < 9) ? <ListItem key={i} primaryText={`_${i + 1}. ${move}`} /> : <ListItem key={i} primaryText={`${i + 1}. ${move}`} />))}
      </List> 
    </MobileTearSheet>
  );
};

export default MoveHistory;
