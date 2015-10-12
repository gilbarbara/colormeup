var React    = require('react'),
	Router   = require('react-router'),
	App      = require('./components/App'),
	NotFound = require('./components/common/NotFound');

var { Route, IndexRoute } = Router;

module.exports = (
	<Route path="/" component={App}>
		<Route path="*" component={NotFound} />
	</Route>
);
