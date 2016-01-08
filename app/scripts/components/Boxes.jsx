import React from 'react';
import reactUpdate from 'react-addons-update';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { autobind } from 'core-decorators';

export default class Boxes extends React.Component {
	constructor(props) {
		super(props);
	}

	static contextTypes = {
		log: React.PropTypes.func,
		setHash: React.PropTypes.func
	};

	static propTypes = {
		config: React.PropTypes.object.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	buildBoxes() {
		const CONFIG = this.props.config;

		if ('rgb'.indexOf(CONFIG.type) > -1) {
			return this.buildRGBBoxes();
		}
		else if ('hsl'.indexOf(CONFIG.type) > -1) {
			return this.buildHSLBoxes();
		}

		return [];
	}

	buildHSLBoxes(options) {
		const CONFIG = this.props.config;
		const settings = Object.assign({
			max: (CONFIG.type === 'h' ? 360 : 100),
			steps: CONFIG.steps
		}, options);
		const rate = settings.max / settings.steps;
		const boxes = [];

		let value = CONFIG.colorObj.hsl[CONFIG.type];

		if (CONFIG.type !== 'h') {
			while (value < settings.max) {
				value += rate;
			}
			value -= rate;
		}

		// this.context.log('buildHSLBoxes', 'type:', CONFIG.type, CONFIG.color, CONFIG.colorObj.hsl);

		for (let i = 0; i < settings.steps; i++) {
			boxes.push(this.buildBox(this.changeHSLValue({ [CONFIG.type]: value < 0 ? settings.max + value : value })));
			value -= rate;
		}

		return boxes;
	}

	buildRGBBoxes(options) {
		const CONFIG = this.props.config;
		const settings = Object.assign({
			max: 255,
			steps: CONFIG.steps
		}, options);
		const rate = settings.max / settings.steps;
		const boxes = [];
		let value = CONFIG.colorObj.rgb[CONFIG.type];

		while (value < settings.max) {
			value += rate;
		}
		value -= rate;

		// this.context.log('buildRGBBoxes', CONFIG.type, CONFIG.color, CONFIG.colorObj.rgb);

		for (let i = 0; i < settings.steps; i++) {
			boxes.push(this.buildBox(this.changeRGBValue({ [CONFIG.type]: Math.round(value) })));
			value -= rate;
		}
		return boxes;
	}

	buildBox(colors, max) {
		const textColor = this.textLightness(colors.hsl);
		return (
			<a
				href="#" key={max + '-' + Math.random()} data-color={colors.hex}
				style={{ backgroundColor: colors.hex }} onClick={this.onClickBox}>
				<span className="app__box" style={{ color: textColor }}>
					{colors.hex}
				</span>
			</a>
		);
	}

	textLightness(color) {
		return this.props.config.colorObj.hsl2hex(Object.assign(color, {
			l: (color.l + 40 > 90 ? Math.abs(50 - color.l) : color.l + 40)
		}));
	}

	changeHSLValue(opts) {
		// this.context.log('changeValue', val, type);
		const CONFIG = this.props.config;
		const colors = {};

		colors.hsl = Object.assign({}, CONFIG.colorObj.hsl, opts);
		colors.rgb = CONFIG.colorObj.hsl2rgb(colors.hsl);
		colors.hex = CONFIG.colorObj.hsl2hex(colors.hsl);

		return colors;
	}

	changeRGBValue(opts) {
		// this.context.log('changeRGBValue', val, type);
		const CONFIG = this.props.config;
		const colors = {};

		colors.rgb = Object.assign({}, CONFIG.colorObj.rgb, opts);
		colors.hsl = CONFIG.colorObj.rgb2hsl(colors.rgb);
		colors.hex = CONFIG.colorObj.rgb2hex(colors.rgb);

		return colors;
	}

	@autobind
	onClickBox(e) {
		e.preventDefault();
		const el = e.currentTarget;

		this.context.setHash({ color: el.dataset.color });

		if (document.body.scrollTop > 150) {
			$('html, body').animate({ scrollTop: 0 }, 500, 'swing');
		}
	}

	render() {
		return (
			<div className="app__boxes">{this.buildBoxes()}</div>
		);
	}
}
