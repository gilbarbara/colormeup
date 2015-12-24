import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import NotFound from './components/common/NotFound';

export default (
	<Route path="/" component={App}>
		<Route path="*" component={NotFound} />
	</Route>
);
