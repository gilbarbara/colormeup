// Polyfills
import 'core-js/modules/es6.promise';
import 'core-js/modules/es6.object.assign';
import 'whatwg-fetch';
import 'classlist-polyfill';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router';
import History from './utils/History';
import routes from './routes';

/**
 * Main
 * @namespace App
 * @description Initialize the Router and mount the React Component
 */

document.addEventListener('DOMContentLoaded', function () {
	ReactDOM.render(<Router history={History}>{routes}</Router>, document.getElementById('react'));
});
