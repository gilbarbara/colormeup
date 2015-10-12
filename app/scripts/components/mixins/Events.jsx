var Events = base => class extends base {
	componentWillMount () {
		console.log('Events');

		if (super.componentWillMount) {
			super.componentWillMount();
		}
	}
};

export default Events;
