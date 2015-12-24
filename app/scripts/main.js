// Polyfills
import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.object.assign';
import 'whatwg-fetch';
import 'classlist-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from './routes';

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(<Router history={createBrowserHistory()}>{routes}</Router>, document.getElementById('react'));
});
