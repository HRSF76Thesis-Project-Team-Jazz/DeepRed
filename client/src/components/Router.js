import React from 'react';
import { Switch, Route } from 'react-router-dom';

import Settings from './Settings';
import App from '../containers/App';
import AIvAI from '../containers/AIvAI';
import AboutPage from './AboutPage';
import Victories from '../containers/Victories';

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
      <Route path="/victories">
        <Victories />
      </Route>
      <Route path="/settings">
        <Settings />
      </Route>
    </Switch>
  </div>
);

export default Router;
