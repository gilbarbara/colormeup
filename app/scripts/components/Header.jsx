import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { autobind, debounce } from 'core-decorators';
import InlineSVG from 'react-inlinesvg';
import InputSlider from 'react-input-slider';
import NumericInput from './common/NumericInput';

import $ from 'jquery';

import math from '../utils/Math';
import { diff } from '../utils/Object';
import Loader from './common/Loader';

class Header extends React.Component {
	constructor (props) {
		super(props);

		this.state = {
			color: props.config.color
		};

		this.tabIndex = 0;
	}

	static contextTypes = {
		location: React.PropTypes.object,
		log: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setOptions: React.PropTypes.func
	};

	static propTypes = {
		config: React.PropTypes.object.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	componentDidMount () {
		setTimeout(() => {
			this.updateColors();
		}, 300);
	}

	componentWillReceiveProps (nextProps, nextContext) {
		if (!diff(nextContext, this.context) && this.props.config.colorObj.parseHex(this.state.color) !== nextProps.config.color) {
			this.setState({
				color: nextProps.config.color
			});
		}
		this.updateColors();
	}

	changeColor (color) {
		this.context.setHash({
			color: this.props.config.colorObj.hsl2hex(color)
		});
	}

	updateColors () {
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

		$('.navigation-toggle-icon').css({
			color: (config.colorObj.saturation > 8 ? (
				config.colorObj.hsl2hex({
					h: Math.abs(config.colorObj.hue + 90),
					s: (config.colorObj.saturation < 30 ? Math.abs(config.colorObj.saturation + 30) : config.colorObj.saturation),
					l: (config.colorObj.lightness < 35 ? config.colorObj.lightness + 20 : config.colorObj.lightness)
				})
			) : (config.colorObj.lightness < 30 ? '#FFF' : '#333'))
		});
	}

	@autobind
	onClickToggleSidebar () {
		$('.app__sidebar,.app-overlay').toggleClass('visible');
	}

	@autobind
	onChangeColorInput (e) {
		const CONFIG = this.props.config;
		let value = e.target.value.replace(/[^0-9A-F]+/i, ''),
			color = '#' + value.replace(/[^0-9A-F]+/i, '').slice(-6);

		//console.log('onChangeColorInput', newValue);

		this.setState({
			color
		}, () => {
			if (CONFIG.colorObj.validHex(this.state.color)) {
				this.changeColor(CONFIG.colorObj.hex2hsl(this.state.color));
			}
		});
	}

	@autobind
	onChangeRangeSlider (pos, props) {
		//console.log('onChangeRangeSlider', pos, props);
		let color           = this.props.config.colorObj.remix({ [props['data-type']]: pos.x }),
			lastSliderValue = this.state.lastSliderValue;

		this.setState({
			lastSliderValue: lastSliderValue === undefined ? Math.round(pos.x) : (lastSliderValue !== Math.round(pos.x) ? Math.round(pos.x) : lastSliderValue)
		}, () => {
			if (lastSliderValue !== this.state.lastSliderValue) {
				this.changeColor(color);
			}
		});
	}

	@autobind
	onChangeRangeInput (value, props) {
		//console.log('onChangeRangeInput', value, props);
		let color = this.props.config.colorObj.remix({ [props.type]: value });

		this.changeColor(color);
	}

	@autobind
	onChangeSteps (value) {
		if (value) {
			this.context.setOptions({ steps: value });
		}
	}

	@autobind
	onClickSliderMenu (e) {
		e.preventDefault();

		this.context.setOptions({ slider: e.currentTarget.dataset.type });
	}

	@autobind
	onClickTypesMenu (e) {
		e.preventDefault();

		this.context.setOptions({ type: e.currentTarget.dataset.type });
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
				value: Math.round(config.slider === 'hsl' ? (config.colorObj.lightness === 0 || config.colorObj.saturation === 0 ? 0 : (this.state.lastSliderValue === 360 ? this.state.lastSliderValue : config.colorObj.hue)) : config.colorObj.red),
				max: config.types[vars.keys[0]].max
			},
			{
				name: config.slider === 'hsl' ? 'Saturation' : 'Green',
				key: vars.keys[1],
				value: Math.round(config.slider === 'hsl' ? (config.colorObj.lightness === 0 ? 0 : config.colorObj.saturation) : config.colorObj.green),
				max: config.types[vars.keys[1]].max
			},
			{
				name: config.slider === 'hsl' ? 'Lightness' : 'Blue',
				key: vars.keys[2],
				value: Math.round(config.slider === 'hsl' ? config.colorObj.lightness : config.colorObj.blue),
				max: config.types[vars.keys[2]].max
			}
		];

		//console.log(config.colorObj.hue, config.colorObj.saturation, config.colorObj.lightness);

		return (
			<div className="app__header"
				 style={{ backgroundColor: config.color, borderColor: config.colorObj.darken(15) }}>
				<div className="app__header__wrapper">
					<div className="logo">
						<InlineSVG src="/media/colormeup.svg" uniquifyIDs={false} />
					</div>

					<div className="app__input">
						<div className="input-group input-group-lg">
							<input
								type="text"
								className="form-control input-color"
								value={this.state.color}
								tabIndex={++this.tabIndex}
								onChange={this.onChangeColorInput} />
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
								<a href="#" data-type="hsl" onClick={this.onClickSliderMenu}>HSL</a>
							</li>
							<li className={config.slider === 'rgb' ? 'active' : null}>
								<a href="#" data-type="rgb" onClick={this.onClickSliderMenu}>RGB</a></li>
						</ul>
						<div className="app__sliders__list">
							{vars.sliders.map((slider, i) => {
								return (
									<div key={i} className="slider-wrapper">
										<span className="range-name">{slider.name}</span>
										<InputSlider
											className="slider"
											data-type={slider.key}
											x={slider.value}
											xmax={slider.max}
											onChange={this.onChangeRangeSlider} />
										<NumericInput
											name="range-input"
											className="form-control"
											min={1}
											max={slider.max}
											value={slider.value}
											type={slider.key}
											tabIndex={++this.tabIndex}
											onChange={this.onChangeRangeInput} />
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
												<a
													key={j} href="#"
													className={'btn btn-' + (config.type === it.key ? 'selected' : 'secondary')}
													data-type={it.key}
													onClick={this.onClickTypesMenu}>
													{it.name}
												</a>
											);
										})}
									</div>
								</div>
							);
						})}
						<div className="steps">
							<span className="fa fa-th" />
							<NumericInput
								className="form-control input-steps"
								min={1}
								max={64}
								value={config.steps}
								tabIndex={++this.tabIndex}
								onChange={this.onChangeSteps} />
						</div>
					</div>
					<div className="app__toggle">
						<input
							id="navigation-checkbox" className="navigation-checkbox" type="checkbox"
							onChange={this.onClickToggleSidebar} />
						<label className="navigation-toggle" htmlFor="navigation-checkbox">
							<span className="navigation-toggle-icon" />
						</label>
					</div>
				</div>
			</div>
		);
	}
}

export default Header;
