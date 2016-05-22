// Polyfills
import 'core-js/shim';
import 'whatwg-fetch';
import 'classlist-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import 'expose?$!expose?jQuery!jquery';
import 'expose?ZeroClipboard!zeroclipboard';

import '../styles/main.scss';
import '../media/og-image.png';

import App from './containers/App';
import NotFound from './containers/NotFound';

/**
 * Main
 * @namespace App
 * @description Initialize the Router and mount the React Component
 */

const routes = (
  <Route path="/" component={App}>
    <Route path="*" component={NotFound} />
  </Route>
);

ReactDOM.render(
  <Router history={browserHistory}>
    {routes}
  </Router>,
  document.getElementById('react')
);
