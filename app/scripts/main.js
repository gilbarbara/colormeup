// Polyfills
import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.object.assign';
import 'whatwg-fetch';
import 'classlist-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory } from 'react-router';

import App from './components/App';
import NotFound from './components/common/NotFound';

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

document.addEventListener('DOMContentLoaded', () => {
	ReactDOM.render(<Router history={browserHistory}>{routes}</Router>, document.getElementById('react'));
});
