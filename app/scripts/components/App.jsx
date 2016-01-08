import React from 'react';
import reactUpdate from 'react-addons-update';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { autobind } from 'core-decorators';

import Colors from '../utils/Colors';
import Storage from '../utils/Storage';
import { param, deparam } from '../utils/Extras';
import changed from '../utils/Changed';

import Loader from './common/Loader';
import Sidebar from './Sidebar';
import Header from './Header';
import Boxes from './Boxes';
import Footer from './Footer';

// todo re-add steps and type to params?
// todo new font!

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			color: '',
			colorObj: null,
			data: {},
			defaultColors: [
				'#30d22b',
				'#f05350',
				'#690780',
				'#1da6d6',
				'#fe7724',
				'#1e4d84',
				'#9bd615',
				'#ac4f44',
				'#ffd200',
				'#ff0044'
			],
			ready: false,
			slider: 'hsl',
			steps: 24,
			type: 'h',
			types: {
				h: {
					name: 'Hue',
					model: 'hsl',
					max: 360
				},
				s: {
					name: 'Saturation',
					model: 'hsl',
					max: 100
				},
				l: {
					name: 'Lightness',
					model: 'hsl',
					max: 100
				},
				r: {
					name: 'Red',
					model: 'rgb',
					max: 255
				},
				g: {
					name: 'Green',
					model: 'rgb',
					max: 255
				},
				b: {
					name: 'Blue',
					model: 'rgb',
					max: 255
				}
			},
			version: 2.0
		};
	}

	static contextTypes = {
		router: React.PropTypes.object
	};

	static childContextTypes = {
		addToFavorites: React.PropTypes.func,
		hideSidebar: React.PropTypes.func,
		log: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setOptions: React.PropTypes.func,
		updateData: React.PropTypes.func
	};

	getChildContext() {
		return {
			addToFavorites: this.addToFavorites,
			hideSidebar: this.hideSidebar,
			log: this.log,
			setHash: this.setHash,
			setOptions: this.setOptions,
			updateData: this.updateData
		};
	}

	static propTypes = {
		history: React.PropTypes.object,
		location: React.PropTypes.object
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	componentWillMount() {
		this.loadData();
	}

	componentDidMount() {
		this.initialize();
	}

	componentWillUpdate() {
		this.scrollTop = document.body.scrollTop;
	}

	componentDidUpdate(prevProps, prevState) {
		 // changed(this, prevProps, prevState);

		if (prevProps.location.pathname !== this.props.location.pathname) {
			const hash = this.getHash();
			// this.log('hashchange', hash);

			if (hash.color) {
				this.setColor('#' + hash.color);
			}
		}

		if (this.scrollTop !== document.body.scrollTop) {
			document.body.scrollTop = this.scrollTop;
		}
	}

	initialize() {
		const STATE = this.state;
		const hash = this.getHash();
		const color = Colors.prototype.validHex('#' + hash.color) ? '#' + hash.color : null;
		const defaultColor = STATE.defaultColors[Math.floor(Math.random() * STATE.defaultColors.length - 1) + 1];

		this.setState({
			color: color || defaultColor
		}, () => {
			this.log('initialize', this.state);
			this.setColor();

			if (!color) {
				this.setHash({
					color: defaultColor
				});
			}
		});
	}

	loadData() {
		let data = Storage.getItem(this.name);

		if (!data || !data.version || data.version < this.state.version) {
			data = {
				version: this.state.version,
				created: Math.floor(Date.now() / 1000),
				updated: null,
				starter: true,
				help: true,
				colors: data && data.colors ? data.colors : []
			};
			this.log('init data');
			this.saveData(data);
		}

		this.log('loadData', data);

		this.setState({
			data
		});
	}

	saveData(data = this.state.data) {
		// this.log('saveData');
		const newData = {
			...data
		};

		newData.version = this.state.version;
		newData.updated = Math.floor(Date.now() / 1000);

		Storage.setItem(this.name, newData);
	}

	@autobind
	updateData(key, value) {
		// this.log('updateData', data);

		this.setState(reactUpdate(this.state, {
			data: { [key]: { $set: value } }
		}), () => {
			this.saveData();
		});
	}

	@autobind
	addToFavorites() {
		// this.log('addToFavorites', this.state.color, this.state.data.colors);

		if (this.state.data.colors.indexOf(this.state.color) === -1) {
			this.setState(reactUpdate(this.state, {
				data: { colors: { $push: [this.state.color] } }
			}), () => {
				this.saveData();
			});
		}
	}

	getHash() {
		let pathname = this.props.location.pathname;

		if (pathname.charAt(0) === '/') {
			pathname = pathname.substring(1);
		}

		return deparam(pathname);
	}

	@autobind
	setHash(opts = {}) {
		const state = this.state;
		const options = Object.assign({
			color: state.color
		}, opts);

		options.color = options.color.replace('#', '');
		// this.log('setHash', options, opts);

		/*		if (state.order !== 'desc') {
		 options.order = state.order;
		 }

		 if (+state.steps !== options.steps) {
		 options.steps = state.steps;
		 }
		 */

		if (param(options) !== param(this.getHash())) {
			this.context.router.push('/' + param(options));
		}
	}

	getColors(max) {
		// this.log('getColors', max);

		const colors = this.state.data.colors.length ? this.state.data.colors : [];
		const single = colors[Math.floor(Math.random() * colors.length)];
		const range = colors.splice(0, max);

		if (!max) {
			return colors;
		}

		if (max === 1) {
			return single;
		}

		return range;
	}

	@autobind
	setColor(color = this.state.color) {
		// this.log('setColor', color);
		const state = {
			color
		};

		if (!this.state.colorObj) {
			state.colorObj = new Colors(color);
		}
		else {
			this.state.colorObj.setColor(color);
		}

		this.setState(state, () => {
			if (!this.state.ready) {
				this.setState({
					ready: true
				});
			}
		});
	}

	@autobind
	setOptions(options) {
		const state = {};
		// this.log('setOptions', options);

		if (options.color) {
			state.color = options.color;
		}

		if (options.type) {
			state.type = options.type;
		}

		if (options.steps) {
			state.steps = options.steps;
		}

		if (options.slider) {
			state.slider = options.slider;
		}

		this.setState(state);
	}

	log() {
		if (location.hostname === 'localhost') {
			console.log(...arguments); //eslint-disable-line no-console
		}
	}

	hideSidebar(e) {
		if (e) {
			e.preventDefault();
		}

		document.querySelector('.app__toggle input').click();
	}

	render() {
		const state = this.state;
		let html;

		if (state.ready) {
			html = (
				<div>
					<Sidebar config={state} />
					<Header config={state} />
					<Boxes config={state} />
				</div>
			);
		}
		else {
			html = (<Loader />);
		}

		return (
			<div className="app" style={{ minHeight: window.innerHeight }}>
				{html}
				<Footer />
				<div className="app__message">Mensagem de erro</div>
				<a href="#" className="app-overlay" onClick={this.hideSidebar} />
			</div>
		);
	}
}

export default App;
