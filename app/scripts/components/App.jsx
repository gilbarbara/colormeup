import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import updateState from 'react-addons-update';
import deparam from 'node-jquery-deparam';
import Colors from '../utils/Colors';
import Storage from '../utils/Storage';

import Loader from './common/Loader';
import Sidebar from './Sidebar';
import Header from './Header';
import Boxes from './Boxes';
import Footer from './Footer';

// Mixins
import mixins from '../utils/Mixins';
import Events from './mixins/Events';

export default class App extends mixins(Events) {
	constructor (props) {
		super(props);

		this.state = {
			name: 'colormeup',
			version: 2.0,
			colorObj: null,
			color: null,
			data: {},
			defaultColors: [
				'#30d22b',
				'#f05350',
				'#443348',
				'#1da6d6',
				'#fe7724',
				'#1e4d84',
				'#9bd615',
				'#4C2719',
				'#ffd200',
				'#ff0044'
			],
			ready: {
				data: false,
				hash: false,
				ui: false
			},
			hash: {},
			types: ['h', 's', 'l', 'r', 'g', 'b'],
			orders: ['asc', 'desc'],
			steps: 4,
			typeSteps: {
				h: {
					optimal: 4,
					max: 360
				},
				s: {
					optimal: 4,
					max: 100
				},
				l: {
					optimal: 4,
					max: 100
				},
				r: {
					optimal: 5,
					max: 255
				},
				g: {
					optimal: 5,
					max: 255
				},
				b: {
					optimal: 5,
					max: 255
				}
			}
		};

		this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this);
	}

	static childContextTypes = {
		log: React.PropTypes.func,
		setColor: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setValue: React.PropTypes.func
	}

	getChildContext () {
		return {
			log: this.log,
			setColor: this.setColor,
			setHash: this.setHash,
			setValue: this.setValue
		};
	}

	componentWillMount () {
		if (super.componentWillMount) {
			super.componentWillMount();
		}
	}

	componentDidMount () {
		this.getData();

		if (super.componentDidMount) {
			super.componentDidMount();
		}
	}

	componentDidUpdate (prevProps, prevState) {
		if (this.state.ready.data && prevState.ready.data !== this.state.ready.data) {
			this.getHash();
		}

		if (this.state.ready.hash && prevState.ready.hash !== this.state.ready.hash) {
			this.setOptions();
		}

		if (super.componentDidUpdate) {
			super.componentDidUpdate();
		}
	}

	log () {
		if (location.hostname === 'localhost') {
			console.log(...arguments);
		}
	}

	setOptions () {
		const state = this.state;
		let settings = Object.assign({
			type: 'h',
			order: 'desc',
			color: '',
			steps: 4
		}, state.hash);

		this.log('setOptions');

		this.setState(updateState(this.state, {
				color: { $set: settings.color && Colors.validHex(settings.color) ? '#' + settings.color : (state.data.color ? this.getColors(1) : state.defaultColors[Math.floor(Math.random() * 6) + 1]) },
				type: { $set: state.types.indexOf(settings.type) > -1 ? settings.type : 'h' },
				order: { $set: state.orders.indexOf(settings.order) > -1 ? settings.order : 'desc' },
				steps: { $set: settings.steps > 1 ? settings.steps : state.typeSteps[state.types.indexOf(settings.type) > -1 ? settings.type : 'h'].optimal }
			}),
			() => {
				this.setColor();
			});
	}

	getData () {
		let data = Storage.getItem(this.name);
		this.log('getData');

		if (!data) {
			data = {
				version: this.state.version,
				created: Math.floor(Date.now() / 1000),
				updated: null,
				starter: true,
				help: true,
				colors: []
			};
			Storage.setItem(this.state.name, data);
		}

		this.setState(updateState(this.state, {
			data: { $set: data },
			ready: { data: { $set: true } }
		}));
	}

	setData () {
		let data = this.state.data;
		this.log('setData');

		data.version = this.version;
		data.updated = Math.floor(Date.now() / 1000);

		Storage.setItem(this.name, data);
	}

	getHash () {
		let hash = Object.assign(this.state.hash, deparam(location.hash.replace('#', '')));
		this.log('getHash', hash);

		this.setState(updateState(this.state, {
			hash: { $set: hash },
			ready: { hash: { $set: true } }
		}));
	}

	setHash () {
		let state   = this.state,
			options = {
				color: state.color.replace('#', ''),
				type: state.type
			},
			hash;

		this.log('setHash');

		if (state.order !== 'desc') {
			options.order = state.order;
		}

		if (+state.steps !== 4) {
			options.steps = state.steps;
		}

		hash = Object.assign(state.hash, options);

		this.setState({
			hash
		});
		location.hash = $.param(hash);
	}

	getColors (max) {
		const state = this.state;
		this.log('getColors', max);

		var colors = state.data.colors.length ? state.data.colors : [],
			single = colors[Math.floor(Math.random() * colors.length)],
			range  = colors.splice(0, max);

		return (!max ? colors : (max === 1 ? single : range));
	}

	setColor () {
		const state = this.state;
		let colorObj = new Colors(state.color);

		this.log('setColor', state.color);
		this.setState({
			colorObj
		}, () => {
			this.setState(updateState(this.state, {
				ready: { ui: { $set: true } }
			}));
		});
	}

	setValue (options) {
		let state = {};
		this.log('setValue', options);

		if (options.color) {
			state.color = (options.color.indexOf('#') === -1 ? '#' : '') + options.color;
		}
		if (options.type) {
			state.type = options.type;
		}
		if (options.steps) {
			state.steps = options.steps;
		}

		this.setState({

		}, () => {
			if (options.color) {
				this.setColor();
			}
		});
	}

	render () {
		const state = this.state;
		let html;

		if (state.ready.ui) {
			html = (
				<div className="app--inner">
					<Sidebar config={state} />
					<Header config={state} />
					<Boxes config={state} />
				</div>
			)
		}
		else {
			html = <Loader />;
		}

		return (
			<div className="app" style={{ minHeight: window.innerHeight }}>
				{html}
				<Footer />
				<div className="app__message">Mensagem de erro</div>
				<div className="app-overlay"></div>
			</div>
		);
	}
}
