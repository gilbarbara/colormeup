import React from 'react';
import reactUpdate from 'react-addons-update';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Colors from '../utils/Colors';
import Loader from './common/Loader';

export default class Boxes extends React.Component {
	constructor (props) {
		super(props);
	}

	static contextTypes = {
		log: React.PropTypes.func
	};

	static propTypes = {
		config: React.PropTypes.object.isRequired

	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	buildBoxes () {
		const CONFIG = this.props.config;

		if ('rgb'.indexOf(CONFIG.type) > -1) {
			return this.buildRGBBoxes();
		}
		else if ('hsl'.indexOf(CONFIG.type) > -1) {
			return this.buildHSLBoxes();
		}

		return [];
	}

	buildBox (color, max) {
		let textColor = this.textLightness(color);
		return (
			<a href="#" key={max + '-' + Math.random()} data-color={color.replace('#', '')}
			   style={{ backgroundColor: color }}>
				<div className="app__box" style={{ color: textColor }}>{color}</div>
			</a>
		);
	}

	buildHSLBoxes (options) {
		const CONFIG = this.props.config;
		let settings = Object.assign({
				max: (CONFIG.type === 'h' ? 356 : 96),
				steps: CONFIG.steps
			}, options),
			max      = (CONFIG.type === 'h' ? Math.round(CONFIG.colorObj.hue) : (CONFIG.order === 'desc' ? settings.max : 0)),
			boxes    = [];

		//this.context.log('buildHSLBoxes', 'type:', CONFIG.type, CONFIG.color, CONFIG.colorObj.hsl);

		while (CONFIG.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeHSLValue(max, (CONFIG.type === 's' && CONFIG.colorObj.saturation === 0 ? 'l' : CONFIG.type)), max));

			max = (CONFIG.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		if (CONFIG.type === 'h') {
			max = (CONFIG.order === 'desc' ? 360 : 0);

			while (CONFIG.order === 'desc' ? max > CONFIG.colorObj.hue : max <= CONFIG.colorObj.hue) {
				boxes.push(this.buildBox(this.changeHSLValue(max, (CONFIG.type === 's' && CONFIG.colorObj.saturation === 0 ? 'l' : CONFIG.type)), max));

				max = (CONFIG.order === 'desc' ? max - settings.steps : max + settings.steps);
			}
		}

		return boxes;
	}

	buildRGBBoxes (options) {
		const CONFIG = this.props.config;
		let settings = Object.assign({
				max: 255,
				steps: CONFIG.steps
			}, options),
			max      = (CONFIG.order === 'desc' ? settings.max : 0),
			boxes    = [];

		//this.context.log('buildRGBBoxes', CONFIG.type, CONFIG.color, CONFIG.colorObj.rgb);

		while (CONFIG.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeRGBValue(max, CONFIG.type)), max);

			max = (CONFIG.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		return boxes;
	}

	textLightness (color) {
		let thisColor = new Colors(color);

		return thisColor.hsl2hex({
			h: thisColor.hue,
			s: thisColor.saturation,
			l: (thisColor.lightness + 40 > 100 ? Math.abs(40 - thisColor.lightness) : thisColor.lightness + 40)
		});
	}

	changeHSLValue (val, type) {
		const CONFIG = this.props.config;
		//this.context.log('changeValue', val, type);

		return CONFIG.colorObj.hsl2hex({
			h: (type === 'h' ? val : CONFIG.colorObj.hue),
			s: (type === 's' ? val : CONFIG.colorObj.saturation),
			l: (type === 'l' ? val : CONFIG.colorObj.lightness)
		});
	}

	changeRGBValue (val, type) {
		const CONFIG = this.props.config;
		//this.context.log('changeRGBValue', val, type);

		return CONFIG.colorObj.rgb2hex({
			r: type === 'r' ? val : CONFIG.colorObj.red,
			g: type === 'g' ? val : CONFIG.colorObj.green,
			b: type === 'b' ? val : CONFIG.colorObj.blue
		});
	}

	render () {
		return (
			<div className="app__boxes">{this.buildBoxes()}</div>
		);
	}
}
