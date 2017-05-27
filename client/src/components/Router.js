import React from 'react';
import Settings from './Settings';
import App from './App';
import { Switch, Route, Link } from 'react-router-dom';

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
