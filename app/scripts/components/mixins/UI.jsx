import Colors from '../../utils/Colors';

var UI = base => class extends base {
	componentWillMount () {
		console.log('UI');

		if (super.componentWillMount) {
			super.componentWillMount();
		}
	}
};

export default UI;
