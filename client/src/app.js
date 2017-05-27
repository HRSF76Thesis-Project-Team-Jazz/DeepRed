import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import Router from './components/Router';

ReactDOM.render((
  <MuiThemeProvider>
    <BrowserRouter>
      <Router />
    </BrowserRouter>
  </MuiThemeProvider>


), document.getElementById('root'));
