import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Settings from './Settings';
import App from '../containers/App';

class Router extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <div>
        <Switch>
          <Route exact path="/">
            <App />
          </Route>
          <Route path="/settings">
            <Settings />
          </Route>
        </Switch>
      </div>
    );
  }
}

export default Router;
