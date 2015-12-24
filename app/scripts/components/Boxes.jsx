import React from 'react';
import reactUpdate from 'react-addons-update';
import shouldPureComponentUpdate from 'react-pure-render/function';
import Colors from '../utils/Colors';
import Loader from './common/Loader';

export default class Boxes extends React.Component {
	constructor (props) {
		super(props);
	}

	shouldComponentUpdate = shouldPureComponentUpdate;

	static propTypes = {
		config: React.PropTypes.object.isRequired
	};

	static contextTypes = {
		log: React.PropTypes.func,
		setColor: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setValue: React.PropTypes.func
	};

	buildBoxes () {
		const props = this.props.config;

		if ('rgb'.indexOf(props.type) > -1) {
			return this.buildRGBBoxes();
		}
		else if ('hsl'.indexOf(props.type) > -1) {
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
		const props = this.props.config;
		let settings = Object.assign({
				max: (props.type === 'h' ? 356 : 96),
				steps: props.steps
			}, options),
			max      = (props.type === 'h' ? Math.round(props.colorObj.hue) : (props.order === 'desc' ? settings.max : 0)),
			boxes    = [];

		//this.context.log('buildHSLBoxes', 'type:', props.type, props.color, props.colorObj.hsl);

		while (props.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeHSLValue(max, (props.type === 's' && props.colorObj.saturation === 0 ? 'l' : props.type)), max));

			max = (props.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		if (props.type === 'h') {
			max = (props.order === 'desc' ? 360 : 0);

			while (props.order === 'desc' ? max > props.colorObj.hue : max <= props.colorObj.hue) {
				boxes.push(this.buildBox(this.changeHSLValue(max, (props.type === 's' && props.colorObj.saturation === 0 ? 'l' : props.type)), max));

				max = (props.order === 'desc' ? max - settings.steps : max + settings.steps);
			}
		}

		return boxes;
	}

	buildRGBBoxes (options) {
		const props = this.props.config;
		let settings = Object.assign({
				max: 255,
				steps: this.steps
			}, options),
			max      = (this.order === 'desc' ? settings.max : 0),
			boxes    = [];

		//this.context.log('buildRGBBoxes', 'type:', this.type, this.color, this.colorObj.rgb);

		while (this.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeRGBValue(max, this.type)), max);

			max = (this.order === 'desc' ? max - settings.steps : max + settings.steps);
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
		const props = this.props.config;
		//this.context.log('changeValue', val, type);

		return props.colorObj.hsl2hex({
			h: (type === 'h' ? val : props.colorObj.hue),
			s: (type === 's' ? val : props.colorObj.saturation),
			l: (type === 'l' ? val : props.colorObj.lightness)
		});
	}

	changeRGBValue (val, type) {
		const props = this.props.config;
		//this.context.log('changeRGBValue', val, type);

		return props.colorObj.rgb2hex({
			r: type === 'r' ? val : props.colorObj.red,
			g: type === 'g' ? val : props.colorObj.green,
			b: type === 'b' ? val : props.colorObj.blue
		});
	}

	render () {
		return (
			<div className="app__boxes">{this.buildBoxes()}</div>
		);
	}
}
