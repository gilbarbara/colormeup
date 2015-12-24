import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import InlineSVG from 'react-inlinesvg';
import $ from 'jquery';

import math from '../utils/Math';
import Loader from './common/Loader';

export default class Header extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			color: undefined
		};

		this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this);
	}

	static contextTypes = {
		location: React.PropTypes.object, // Router
		log: React.PropTypes.func,
		setColor: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setOptions: React.PropTypes.func
	}

	static propTypes = {
		config: React.PropTypes.object.isRequired
	}

	componentWillMount () {
		this.setState({
			color: this.props.config.color
		});
	}

	componentDidMount () {
		setTimeout(() => {
			this._updateLogo();
		}, 100);
	}

	componentDidUpdate (prevProps) {
		if (prevProps.config.color !== this.props.config.color) {
			this.setState({
				color: this.props.config.color
			});
		}

		this._updateLogo();
	}

	_onClickToggleSidebar () {
		$('.app__sidebar,.app-overlay').toggleClass('visible');
	}

	_onChangeColorInput (e) {
		let value    = e.target.value.replace('#', ''),
			newValue = '#',
			bits     = [];

		if (/^[#0-9A-F]+$/i.test(value)) {
			this.setState({
				color: '#' + value.slice(-6)
			});

			bits = value.replace('#', '').slice(-6).split('')
		}

		if (bits.length === 3) {
			bits.forEach(d => {
				newValue += d + d;
			});
		}
		else if (bits.length === 6) {
			newValue += bits.join('');
		}

		if (this.props.config.colorObj.validHex(newValue)) {
			this._changeColor(newValue);
		}
	}

	_onChangeRangeSlider (e) {
		let el    = e.target,
			color = this.props.config.colorObj.remix({ key: el.dataset.type, value: el.value });
		console.log('_onChangeRangeSlider', el.value);
		this._changeColor(color);
	}

	_onChangeRangeInput (e) {
		let el       = e.target,
			value    = parseInt(el.value, 10),
			newValue = isNaN(value) ? 0 : (value < el.previousSibling.min ? el.previousSibling.min : (value > el.previousSibling.max ? el.previousSibling.max : value)),
			color    = this.props.config.colorObj.remix({ key: el.dataset.type, value: newValue });

		console.log('_onChangeRangeInput', newValue);
		this._changeColor(color);
	}

	_onClickSliderMenu (e) {
		e.preventDefault();

		this.context.setOptions({ slider: e.currentTarget.dataset.type });
	}

	_onClickTypesMenu (e) {
		e.preventDefault();

		this.context.setOptions({ type: e.currentTarget.dataset.type });
	}

	_changeColor (color) {
		this.context.setOptions({
			color
		});
	}

	_updateLogo () {
		var config = this.props.config;

		$('.logo svg')
			.find('#color').css({
			fill: (config.colorObj.saturation > 8 ? (
				config.colorObj.hsl2hex({
					h: Math.abs(config.colorObj.hue + 90),
					s: (config.colorObj.saturation < 30 ? Math.abs(config.colorObj.saturation + 30) : config.colorObj.saturation),
					l: (config.colorObj.lightness < 35 ? config.colorObj.lightness + 20 : config.colorObj.lightness)
				})
			) : (config.colorObj.lightness < 30 ? '#FFF' : '#333')),
			fillOpacity: (config.colorObj.saturation < 10 ? 0.6 : 1)
		}).end()
			.find('#me').css({
			fill: (config.colorObj.saturation > 8 ? (
				config.colorObj.hsl2hex({
					h: Math.abs(config.colorObj.hue + 180),
					s: (config.colorObj.saturation < 30 ? Math.abs(config.colorObj.saturation + 30) : config.colorObj.saturation),
					l: (config.colorObj.lightness < 35 ? config.colorObj.lightness + 20 : config.colorObj.lightness)
				})
			) : (config.colorObj.lightness < 30 ? '#FFF' : '#333')),
			fillOpacity: (config.colorObj.saturation < 10 ? 0.4 : 1)
		}).end()
			.find('#up').css({
			fill: (config.colorObj.saturation > 8 ? (
				config.colorObj.hsl2hex({
					h: Math.abs(config.colorObj.hue + 270),
					s: (config.colorObj.saturation < 30 ? Math.abs(config.colorObj.saturation + 30) : config.colorObj.saturation),
					l: (config.colorObj.lightness < 35 ? config.colorObj.lightness + 20 : config.colorObj.lightness)
				})
			) : (config.colorObj.lightness < 30 ? '#FFF' : '#333')),
			fillOpacity: (config.colorObj.saturation < 10 ? 0.2 : 1)
		}).end();
	}

	render () {
		const config = this.props.config;

		let vars = {
			keys: [
				config.slider === 'hsl' ? 'h' : 'r',
				config.slider === 'hsl' ? 's' : 'g',
				config.slider === 'hsl' ? 'l' : 'b'
			],
			types: {}
		};

		Object.keys(config.types).map(t => {
			if (!vars.types[config.types[t].model]) {
				vars.types[config.types[t].model] = [];
			}
			config.types[t].key = t;
			vars.types[config.types[t].model].push(config.types[t]);
		});

		vars.sliders = [
			{
				name: config.slider === 'hsl' ? 'Hue' : 'Red',
				key: vars.keys[0],
				value: (config.colorObj.saturation === 0 || config.colorObj.lightness === 0
					? 0
					: (config.colorObj.hue === 0 && this.refs[vars.keys[0] + '-slider']
					? this.refs[vars.keys[0] + '-slider'].value
					: Math.round(config.slider === 'hsl' ? config.colorObj.hue : config.colorObj.red))),
				max: config.types[vars.keys[0]].max
			},
			{
				name: config.slider === 'hsl' ? 'Saturation' : 'Green',
				key: vars.keys[1],
				value: Math.round(config.slider === 'hsl' ? config.colorObj.saturation : config.colorObj.green),
				max: config.types[vars.keys[1]].max
			},
			{
				name: config.slider === 'hsl' ? 'Lightness' : 'Blue',
				key: vars.keys[2],
				value: Math.round(config.slider === 'hsl' ? config.colorObj.lightness : config.colorObj.blue),
				max: config.types[vars.keys[2]].max
			}
		];

		return (
			<div className="app__header"
				 style={{ backgroundColor: config.color, borderColor: config.colorObj.darken(15) }}>
				<div className="logo">
					<InlineSVG src="/media/colormeup.svg" uniquifyIDs={false} />
				</div>

				<div className="app__input">
					<div className="input-group input-group-lg">
						<input type="text" className="form-control input-color"
							   value={this.state.color} onChange={this._onChangeColorInput.bind(this)} />
							<span className="input-group-addon">
							<a href="#" className="save-color" title="Add to Favorites">
								<span className="fa fa-heart" />
							</a>
							</span>
					</div>
				</div>

				<div className="app__sliders">
					<ul className="app__sliders__menu list-unstyled">
						<li className={config.slider === 'hsl' ? 'active' : null}>
							<a href="#" data-type="hsl" onClick={this._onClickSliderMenu.bind(this)}>HSL</a>
						</li>
						<li className={config.slider === 'rgb' ? 'active' : null}>
							<a href="#" data-type="rgb" onClick={this._onClickSliderMenu.bind(this)}>RGB</a></li>
					</ul>
					<div className="app__sliders__list">
						{vars.sliders.map((slider, i) => {
							return (
							<div key={i} className="slider">
								<span className="range-name">{slider.name}</span>
								<input type="range" ref={slider.key + '-slider'}
									   className="range-slider" data-type={slider.key}
									   data-target={slider.key + '-input'} step="1"
									   value={slider.value} min="0" max={slider.max}
									   onChange={this._onChangeRangeSlider.bind(this)} />
								<input type="tel" ref={slider.key + '-input'}
									   className="range-input" data-type={slider.key}
									   data-target={slider.key + '-slider'}
									   value={slider.value} tabIndex={i + 1}
									   onChange={this._onChangeRangeInput.bind(this)} />
							</div>
								);
							})}
					</div>
				</div>

				<div className="app__info">
					{Object.keys(vars.types).map((t, i) => {
						return (
						<div key={i} className={t}>
							{vars.types[t].map((it, j) => {
								return (
								<div key={j} className="color-value">
									<div
										className={'color-' + it.key}>{Math.round(config.colorObj[it.name.toLowerCase()])}</div>
									{it.name.toLowerCase()}
								</div>
									);
								})}
						</div>
							);
						})}
				</div>

				<div className="app__type">
					{Object.keys(vars.types).map((t, i) => {
						return (
						<div key={i} className={t}>
							<div className="btn-group" role="group" aria-label={t}>
								{vars.types[t].map((it, j) => {
									return (
									<a key={j} href="#" className="btn btn-secondary"
									   data-type={it.key} onClick={this._onClickTypesMenu.bind(this)}>{it.name}</a>
										);
									})}
							</div>
						</div>
							);
						})}
					<div className="steps">
						<span className="fa fa-th" />
						<input type="text" className="form-control input-steps" placeholder="steps"
							   defaultValue={config.steps} />
					</div>
				</div>
				<div className="app__toggle">
					<input id="navigation-checkbox" className="navigation-checkbox" type="checkbox"
						   onChange={this._onClickToggleSidebar} />
					<label className="navigation-toggle" htmlFor="navigation-checkbox">
						<span className="navigation-toggle-icon" />
					</label>
				</div>
			</div>
		);
	}
}
