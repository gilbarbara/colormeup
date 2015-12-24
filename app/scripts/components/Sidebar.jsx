import React from 'react';
import shouldPureComponentUpdate from 'react-pure-render/function';

import math from '../utils/Math';
import Loader from './common/Loader';

export default class Sidebar extends React.Component {
	constructor (props) {
		super(props);
	}

	shouldComponentUpdate = shouldPureComponentUpdate;

	static contextTypes = {
		location: React.PropTypes.object, // Router
		log: React.PropTypes.func,
		setColor: React.PropTypes.func,
		setHash: React.PropTypes.func,
		setValue: React.PropTypes.func
	}

	static propTypes = {
		config: React.PropTypes.object.isRequired
	}

	render () {
		const config = this.props.config;

		let vars = {
			hex: config.color,
			hsl: 'hsl(' + Math.round(config.colorObj.hue) + ', ' + Math.round(config.colorObj.saturation) + '%' + ', ' + Math.round(config.colorObj.lightness) + '%' + ')',
			rgb: 'rgb(' + config.colorObj.red + ', ' + config.colorObj.green + ', ' + config.colorObj.blue + ')',
			currentColor: (config.colorObj.saturation > 8 ? (
				config.colorObj.hsl2hex({
					h: Math.abs(config.colorObj.hue + 90),
					s: (config.colorObj.saturation < 30 ? Math.abs(config.colorObj.saturation + 30) : config.colorObj.saturation),
					l: (config.colorObj.lightness < 35 ? config.colorObj.lightness + 20 : config.colorObj.lightness)
				})
			) : (config.colorObj.lightness < 30 ? '#FFF' : '#333'))
		};

		return (
			<div className="app__sidebar">
				<div className="app__sidebar__list default">
					<h3>starter kit
						<a href="#" title="Hide this kit" className="hide-starter reset">
							<span className="fa fa-eye-slash" />
						</a>
					</h3>
					<div className="items">{
						config.defaultColors.map((d, i) => {
							return (<a key={i} href="#" data-color={d.replace('#', '')}
									   style={{ backgroundColor: d }} />);
							})
						}</div>
				</div>

				<div className="app__sidebar__list favorites">
					<h3>your favorites
						<a href="#" title="Erase your favorites" className="erase-favorites reset">
							<span className="fa fa-trash" />
						</a></h3>
					<div className="items"></div>
				</div>

				<div className="app__sidebar__list export">
					<h3><a href="#" className="toggle">values</a></h3>
					<div className="code">
						<div className="hex-copy clearfix">
							<span>{vars.hex}</span>
							<a href="#" data-clipboard-text="copy-me" className="copy-button">
								<i className="fa fa-copy" />
							</a>
						</div>
						<div className="rgb-copy clearfix">
							<span>{vars.rgb}</span>
							<a href="#" data-clipboard-text="copy-me" className="copy-button">
								<i className="fa fa-copy" />
							</a>
						</div>
						<div className="hsl-copy clearfix"><span>{vars.hsl}</span><a href="#"
																					 data-clipboard-text="copy-me"
																					 className="copy-button"><i
							className="fa fa-copy" /></a></div>
					</div>
				</div>

				<div className="app__sidebar__list help">
					<h3><a href="#" className="toggle">
						<span className="fa fa-question-circle" /> Help</a>
					</h3>
					<div className="text">
						<h5 style={{color: config.colorObj.lightness < 20 ? '#fff' : config.color }}>Know thy color!</h5>
						<p>colormeup is a tool to inspect a color and play with its many variations in Hue (0-360), Saturation and Lightness (0-100) and also RGB (0-255).
						</p>
						<p>
							<span className="fa fa-th" /> change the steps to get a different number of colors
						</p>
						<p><span className="fa fa-tint" /> open the color picker</p>
						<p><span className="fa fa-heart" /> save to your favorites</p>
						<p className="restore-starter">
							<a href="#" className="btn btn-default btn-xs">Restore starter kit</a>
						</p>
					</div>
				</div>
			</div>
		);
	}
}
