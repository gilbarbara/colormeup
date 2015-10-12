import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import updateState from 'react-addons-update';
import Colors from '../utils/Colors';
import Loader from './common/Loader';

class Boxes extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			ready: false
		};

		this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this);
	}

	componentDidUpdate (prevProps) {
		if (this.props.app.ready.ui && prevProps.app.ready.ui !== this.props.app.ready.ui) {
			this.setState({
				ready: true
			});
		}
	}

	buildBoxes () {
		const props = this.props.app;

		if ('rgb'.indexOf(props.type) > -1) {
			return this.buildRGBBoxes();
		}
		else if ('hsl'.indexOf(props.type) > -1) {
			return this.buildHSLBoxes();
		}

		return [];
	}

	buildBox (color) {
		var textColor = this.textLightness(color);
		return (
			<a href="#" key={color + Math.ceil(Math.random() * 1000)} data-color={color.replace('#', '')} style={{ backgroundColor: color }}>
				<div className="app__box" style={{ color: textColor }}>{color}</div>
			</a>
		);
	}

	buildHSLBoxes (options) {
		const props = this.props.app;
		var settings = Object.assign({
			max: (props.type === 'h' ? 356 : 96),
			steps: props.steps
		}, options);

		this.context.log('buildHSLBoxes', 'type:', props.type, props.color, props.colorObj.hsl);

		var max   = (props.type === 'h' ? props.colorObj.hue : (props.order === 'desc' ? settings.max : 0)),
			boxes = [];

		while (props.order === 'desc' ? max > 0 : max <= settings.max) {

			boxes.push(this.buildBox(this.changeHSLValue(max, (props.type === 's' && +props.colorObj.hsl.s === 0 ? 'l' : props.type))));

			max = (props.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		if (props.type === 'h') {
			max = (props.order === 'desc' ? 360 : 0);

			while (props.order === 'desc' ? max > props.colorObj.hue : max <= props.colorObj.hue) {
				boxes.push(this.buildBox(this.changeHSLValue(max, (props.type === 's' && +props.colorObj.hsl.s === 0 ? 'l' : props.type))));

				max = (props.order === 'desc' ? max - settings.steps : max + settings.steps);
			}
			this.context.log('buildHSLBoxes: hue extra loop', props.colorObj.hue, max);
		}

		return boxes;
	}

	buildRGBBoxes (options) {
		const props = this.props.app;
		var settings = Object.assign({
			max: 255,
			steps: this.steps
		}, options);

		this.context.log('buildRGBBoxes', 'type:', this.type, this.color, this.colorObj.rgb);

		var max   = (this.order === 'desc' ? settings.max : 0),
			boxes = [];

		while (this.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeRGBValue(max, this.type)));

			max = (this.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		return boxes;
	}

	textLightness (color) {
		var thisColor = new Colors(color);

		return thisColor.hsl2hex({
			h: thisColor.hsl.h,
			s: thisColor.hsl.s,
			l: (+thisColor.hsl.l + 40 > 100 ? Math.abs(40 - +thisColor.hsl.l) : +thisColor.hsl.l + 40)
		});
	}

	changeHSLValue (val, type) {
		const props = this.props.app;
		//this.context.log('changeValue', val, type);

		return props.colorObj.hsl2hex({
			h: (type === 'h' ? val : props.colorObj.hsl.h),
			s: (type === 's' ? val : props.colorObj.hsl.s),
			l: (type === 'l' ? val : props.colorObj.hsl.l)
		});
	}

	changeRGBValue (val, type) {
		const props = this.props.app;
		//this.context.log('changeRGBValue', val, type);

		return props.colorObj.rgb2hex({
			r: type === 'r' ? val : props.colorObj.rgb.r,
			g: type === 'g' ? val : props.colorObj.rgb.g,
			b: type === 'b' ? val : props.colorObj.rgb.b
		});
	}

	render () {
		const state = this.state;
		let output = {};

		if (state.ready) {
			output.html = (
				<div className="app__boxes">
					{this.buildBoxes()}
				</div>
			);
		}
		else {
			output.html = <Loader />;
		}

		return output.html;
	}
}

Boxes.propTypes = {
	app: React.PropTypes.object.isRequired
};

Boxes.contextTypes = {
	log: React.PropTypes.func
};

export default Boxes;
