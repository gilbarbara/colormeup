import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';
import { autobind } from 'core-decorators';
import classNames from 'classnames';

import $ from 'jquery';
import ZeroClipboard from 'zeroclipboard';

export default class Sidebar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			pendingReset: false
		};
	}

	static contextTypes = {
		hideSidebar: React.PropTypes.func,
		log: React.PropTypes.func,
		setHash: React.PropTypes.func,
		updateData: React.PropTypes.func
	};

	static propTypes = {
		config: React.PropTypes.object.isRequired
	};

	shouldComponentUpdate = shouldPureComponentUpdate;

	componentDidMount() {
		var clipboard = new ZeroClipboard(document.getElementsByClassName('copy-button'));

		clipboard.on('aftercopy', (event) => {
			// console.log('aftercopy', event.data['text/plain']);
			// `this` === `client`
			// `event.target` === the element that was clicked
		});
	}

	@autobind
	onClickResetFavorites(e) {
		e.preventDefault();

		if (this.state.pendingReset) {
			this.context.updateData('colors', []);
		}
		else {
			this.setState({
				pendingReset: true
			}, () => {
				setTimeout(() => {
					this.setState({
						pendingReset: false
					});
				}, 4000);
			});
		}
	}

	@autobind
	onClickHelp(e) {
		e.preventDefault();
		this.context.updateData('help', !this.props.config.data.help);

		$('.help .text').slideToggle();
	}

	@autobind
	onClickHideStarter(e) {
		e.preventDefault();

		this.context.updateData('starter', !this.props.config.data.starter);
	}

	@autobind
	onClickRestore(e) {
		e.preventDefault();

		this.context.updateData('starter', true);
	}

	@autobind
	onClickColor(e) {
		e.preventDefault();

		this.context.hideSidebar();
		this.context.setHash({
			color: e.currentTarget.dataset.color
		});
	}

	preventClick(e) {
		e.preventDefault();
	}

	render() {
		const CONFIG = this.props.config,
			  STATE  = this.state;

		let vars   = {
				hex: CONFIG.color,
				hsl: 'hsl(' + Math.round(CONFIG.colorObj.hue) + ', ' + Math.round(CONFIG.colorObj.saturation) + '%, ' + Math.round(CONFIG.colorObj.lightness) + '%)',
				rgb: 'rgb(' + CONFIG.colorObj.red + ', ' + CONFIG.colorObj.green + ', ' + CONFIG.colorObj.blue + ')',
				currentColor: (CONFIG.colorObj.saturation > 8 ? (
					CONFIG.colorObj.hsl2hex({
						h: Math.abs(CONFIG.colorObj.hue + 90),
						s: (CONFIG.colorObj.saturation < 30 ? Math.abs(CONFIG.colorObj.saturation + 30) : CONFIG.colorObj.saturation),
						l: (CONFIG.colorObj.lightness < 35 ? CONFIG.colorObj.lightness + 20 : CONFIG.colorObj.lightness)
					})
				) : (CONFIG.colorObj.lightness < 30 ? '#FFF' : '#333'))
			},
			output = {};

		if (CONFIG.data.starter) {
			output.default = (
				<div className="app__sidebar__list default">
					<h3>
						<span className="fa fa-bolt" /> starter kit
						<a href="#" title="Hide this kit" className="hide-starter reset"
						   onClick={this.onClickHideStarter}>
							<span className="fa fa-eye-slash" />
						</a>
					</h3>
					<div className="items">{
						CONFIG.defaultColors.map((d, i) => {
							return (<a key={i} href="#" data-color={d}
									   style={{ backgroundColor: d }} onClick={this.onClickColor} />);
						})
					}</div>
				</div>
			);
		}
		else {
			output.restore = (
				<p className="restore-starter">
					<a href="#" className="btn btn-secondary btn-xs"
					   onClick={this.onClickRestore}>Restore starter kit</a>
				</p>
			);
		}

		return (
			<div className="app__sidebar">
				<div className="app__sidebar__list favorites">
					<h3><span className="fa fa-heart" /> your favorites
						{CONFIG.data.colors.length ?
						 <a href="#" title="Erase your favorites" className="erase-favorites reset"
							onClick={this.onClickResetFavorites}>
								<span
									className={classNames('fa', { 'fa-trash': !STATE.pendingReset, 'fa-check-circle': STATE.pendingReset })} />
						 </a> : undefined}
					</h3>
					<div className="items">{
						CONFIG.data.colors.length
							? CONFIG.data.colors.map((d, i) => {
							return (<a key={i} href="#" data-color={d}
									   style={{ backgroundColor: d }} onClick={this.onClickColor} />);
						})
							: <p>No favorites yet!</p>

					}</div>
				</div>
				{output.default}
				<div className="app__sidebar__list export">
					<h3>
						<span className="fa fa-eyedropper" /> values
					</h3>
					<div className="code">
						<div className="hex-copy clearfix">
							<span>{vars.hex}</span>
							<a href="#" className="copy-button" data-clipboard-text={vars.hex}
							   onClick={this.preventClick}>
								<i className="fa fa-copy" />
							</a>
						</div>
						<div className="rgb-copy clearfix">
							<span>{vars.rgb}</span>
							<a href="#" className="copy-button" data-clipboard-text={vars.rgb}
							   onClick={this.preventClick}>
								<i className="fa fa-copy" />
							</a>
						</div>
						<div className="hsl-copy clearfix">
							<span>{vars.hsl}</span>
							<a href="#" className="copy-button" data-clipboard-text={vars.hsl}
							   onClick={this.preventClick}>
								<i className="fa fa-copy" />
							</a>
						</div>
					</div>
				</div>

				<div className="app__sidebar__list help">
					<h3>
						<a href="#" className="toggle" onClick={this.onClickHelp}>
							<span className="fa fa-question-circle" /> Help
						</a>
					</h3>
					<div className={classNames('text', { hidden: !CONFIG.data.help })}>
						<h5 style={{ color: CONFIG.colorObj.lightness < 20 ? '#fff' : CONFIG.color }}>Know thy color!</h5>
						<p>colormeup is a tool to inspect colors and play with its many variations in HSL or RGB.
						</p>
						<ul className="list-unstyled">
							<li><span className="fa fa-th fa-fw" /> change the number of colors</li>
							<li><span className="fa fa-refresh fa-fw" /> generate a new color</li>
							<li><span className="fa fa-heart fa-fw" /> save to your favorites</li>
						</ul>

						{output.restore}
					</div>
				</div>
			</div>
		);
	}
}
