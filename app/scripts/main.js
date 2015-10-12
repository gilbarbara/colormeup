import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

// Polyfills
require('babel/polyfill');
require('whatwg-fetch');
require('es6-promise').polyfill();

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(<Router history={createBrowserHistory()}>{routes}</Router>, document.getElementById('react'));
});
