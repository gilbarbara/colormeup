import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { autobind } from 'core-decorators';
import InlineSVG from 'react-inlinesvg';
import InputSlider from 'react-input-slider';
import NumericInput from './common/NumericInput';

import $ from 'jquery';

import math from '../utils/Math';
import { isEqual } from '../utils/Extras';
import Loader from './common/Loader';

class Header extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			color: props.config.color
		};

		this.tabIndex = 1;
	}

	static contextTypes = {
		addToFavorites: React.PropTypes.func,
		log: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setOptions: React.PropTypes.func
	};

	static propTypes = {
		config: React.PropTypes.object.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	componentDidMount() {
		setTimeout(() => {
			this.updateColors();
		}, 300);

		this.keyPressListener = (e) => {
			if (e.target.tagName === 'BODY' && e.keyCode === 32) {
				e.preventDefault();
				document.querySelector('.random-color').click();
			}
		};

		document.addEventListener('keypress', this.keyPressListener);
	}

	componentWillReceiveProps(nextProps, nextContext) {
		if (!isEqual(nextContext, this.context) && this.props.config.colorObj.parseHex(this.state.color) !== nextProps.config.color) {
			this.setState({
				color: nextProps.config.color
			});
		}
		this.updateColors();
	}

	componentWillUnmount() {
		document.body.removeEventListener('keypress', this.keyPressListener);
	}

	/**
	 * @param {Object} opts
	 */
	changeColor(opts = {}) {
		this.context.setHash({
			color: typeof opts.r === 'number' ? this.props.config.colorObj.rgb2hex(opts) : this.props.config.colorObj.hsl2hex(opts)
		});
	}

	updateColors() {
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
	onClickToggleSidebar() {
		$('.app__sidebar, .app-overlay').toggleClass('visible');
	}

	@autobind
	onChangeColorInput(e) {
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
	onChangeRangeSlider(pos, props) {
		let value     = ['r', 'g', 'b'].indexOf(props['data-type']) > -1 ? Math.round(pos.x) : pos.x,
			newValue  = Math.round(pos.x),
			color     = this.props.config.colorObj.remix({ [props['data-type']]: value }),
			lastValue = this.state.lastSliderValue;

		//console.log('onChangeRangeSlider', value, newValue props);

		this.setState({
			lastSliderValue: lastValue === undefined ? newValue : (lastValue !== newValue ? newValue : lastValue)
		}, () => {
			if (lastValue !== this.state.lastSliderValue) {
				this.changeColor(color);
			}
		});
	}

	@autobind
	onChangeRangeInput(value, props) {
		let color = this.props.config.colorObj.remix({ [props['data-type']]: value });
		//console.log('onChangeRangeInput', value, props, color);

		this.changeColor(color);
	}

	@autobind
	onClickSliderMenu(e) {
		e.preventDefault();

		this.context.setOptions({ slider: e.currentTarget.dataset.type });
	}

	@autobind
	onChangeSteps(value) {
		if (value) {
			this.context.setOptions({ steps: value });
		}
	}

	@autobind
	onClickTypesMenu(e) {
		e.preventDefault();

		this.context.setOptions({ type: e.currentTarget.dataset.type });
	}

	@autobind
	onClickRandomColor(e) {
		e.preventDefault();
		let el          = e.currentTarget,
			randomColor = this.props.config.colorObj.random();

		$(el).addClass('rotate');
		setTimeout(() => {
			$(el).removeClass('rotate');
		}, 400);

		this.changeColor(randomColor.hsl);
	}

	@autobind
	onClickSaveColor(e) {
		e.preventDefault();
		let el     = e.currentTarget,
			$icon  = $(el).find('.fa-heart'),
			offset = $icon.offset();

		$($icon
			.clone()
			.css({
				fontSize: $icon.css('font-size'),
				position: 'absolute',
				top: offset.top,
				left: offset.left
			})
			.addClass('grow-element'))
			.appendTo('body');

		$('.grow-element').addClass('grow');
		setTimeout(() => {
			$('.grow-element').remove();
		}, 800);

		this.context.addToFavorites();
	}

	render() {
		const CONFIG = this.props.config;

		let vars = {
			keys: [
				CONFIG.slider === 'hsl' ? 'h' : 'r',
				CONFIG.slider === 'hsl' ? 's' : 'g',
				CONFIG.slider === 'hsl' ? 'l' : 'b'
			],
			types: {}
		};

		Object.keys(CONFIG.types).map(t => {
			if (!vars.types[CONFIG.types[t].model]) {
				vars.types[CONFIG.types[t].model] = [];
			}
			CONFIG.types[t].key = t;
			vars.types[CONFIG.types[t].model].push(CONFIG.types[t]);
		});

		vars.sliders = [
			{
				name: CONFIG.slider === 'hsl' ? 'Hue' : 'Red',
				key: vars.keys[0],
				value: Math.round(CONFIG.slider === 'hsl' ? (CONFIG.colorObj.lightness === 0 || CONFIG.colorObj.saturation === 0 ? 0 : (this.state.lastSliderValue === 360 ? this.state.lastSliderValue : CONFIG.colorObj.hue)) : CONFIG.colorObj.red),
				max: CONFIG.types[vars.keys[0]].max
			},
			{
				name: CONFIG.slider === 'hsl' ? 'Saturation' : 'Green',
				key: vars.keys[1],
				value: Math.round(CONFIG.slider === 'hsl' ? (CONFIG.colorObj.lightness === 0 ? 0 : CONFIG.colorObj.saturation) : CONFIG.colorObj.green),
				max: CONFIG.types[vars.keys[1]].max
			},
			{
				name: CONFIG.slider === 'hsl' ? 'Lightness' : 'Blue',
				key: vars.keys[2],
				value: Math.round(CONFIG.slider === 'hsl' ? CONFIG.colorObj.lightness : CONFIG.colorObj.blue),
				max: CONFIG.types[vars.keys[2]].max
			}
		];

		//console.log(CONFIG.colorObj.hue, CONFIG.colorObj.saturation, CONFIG.colorObj.lightness);

		return (
			<div className="app__header"
				 style={{ backgroundColor: CONFIG.color, borderColor: CONFIG.colorObj.darken(15) }}>
				<div className="app__header__wrapper">
					<div className="logo">
						<InlineSVG src="/media/colormeup.svg" uniquifyIDs={false} />
					</div>

					<div className="app__input">
						<div className="input-group input-group-lg">
							<span className="input-group-btn">
							<a
								href="#" className="btn btn-secondary random-color"
								title="Randomize Color"
								onClick={this.onClickRandomColor}>
								<span className="fa fa-refresh" />
							</a>
							</span>
							<input
								type="text"
								className="form-control input-color"
								value={this.state.color}
								tabIndex={1}
								onChange={this.onChangeColorInput} />
							<span className="input-group-btn">
							<a
								href="#" className="btn btn-secondary save-color"
								title="Add to Favorites"
								onClick={this.onClickSaveColor}>
								<span className="fa fa-heart" />
							</a>
							</span>
						</div>
					</div>
					<div className="app__sliders">
						<ul className="app__sliders__menu list-unstyled">
							<li className={CONFIG.slider === 'hsl' ? 'active' : null}>
								<a href="#" data-type="hsl" onClick={this.onClickSliderMenu}>HSL</a>
							</li>
							<li className={CONFIG.slider === 'rgb' ? 'active' : null}>
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
											min={0}
											max={slider.max}
											value={slider.value}
											data-type={slider.key}
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
													className={'color-' + it.key}>{Math.round(CONFIG.colorObj[it.name.toLowerCase()])}</div>
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
													className={'btn btn-' + (CONFIG.type === it.key ? 'selected' : 'secondary')}
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
								value={CONFIG.steps}
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
