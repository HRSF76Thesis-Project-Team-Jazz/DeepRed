import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Settings from './Settings';
import App from '../containers/App';
import AIvAI from '../containers/AIvAI';
import AboutPage from './AboutPage';
import ShameBoard from '../containers/ShameBoard';

const Router = () => (
  <div>
    <Switch>
      <Route exact path="/">
        <App />
      </Route>
      <Route path="/ai">
        <AIvAI />
      </Route>
      <Route path="/about">
        <AboutPage />
      </Route>
      <Route path="/shame">
        <ShameBoard />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
    </Switch>
  </div>
);

export default Router;
