import React from 'react';
import pureRenderMixin from 'react-addons-pure-render-mixin';
import InlineSVG from 'react-inlinesvg';
import $ from 'jquery';
import math from '../utils/Math';
import Loader from './common/Loader';

export default class Header extends React.Component {
	constructor (props) {
		super(props);

		this.shouldComponentUpdate = pureRenderMixin.shouldComponentUpdate.bind(this);
	}

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

	_onClickToggleSidebar (e) {
		var el = e.target;
		console.log(el.checked);
		$('.app__sidebar,.app-overlay').toggleClass('visible');
	}

	render () {
		const props = this.props.config;

		return (
			<div className="app__header"
				 style={{ backgroundColor: props.color, borderColor: props.colorObj.darken(15) }}>
				<div className="logo">
					<InlineSVG src="/media/colormeup.svg" uniquifyIDs={false} />
				</div>

				<div className="app__input">
					<div className="input-group input-group-lg">
							<span className="input-group-addon">
								<a href="#" className="color-picker" title="Show Picker">
									<span className="fa fa-tint" />
								</a>
					  		</span>
						<input type="text" className="form-control input-color" placeholder="Hex color"
							   defaultValue={props.color.replace('#', '')} />
						  <span className="input-group-addon">
							<a href="#" className="save-color" title="Add to Favorites">
								<span className="fa fa-heart" />
							</a>
						  </span>
					</div>
				</div>

				<div className="app__info">
					<div className="hsl">
						<div className="color-value">
							<div className="color-h">{math.round(props.colorObj.hue)}</div>
							hue
						</div>
						<div className="color-value">
							<div className="color-s">{math.round(props.colorObj.saturation)}</div>
							saturation
						</div>
						<div className="color-value">
							<div className="color-l">{math.round(props.colorObj.lightness)}</div>
							lightness
						</div>
					</div>
					<div className="rgb">
						<div className="color-value">
							<div className="color-r">{math.round(props.colorObj.red)}</div>
							red
						</div>
						<div className="color-value">
							<div className="color-g">{math.round(props.colorObj.green)}</div>
							green
						</div>
						<div className="color-value">
							<div className="color-b">{math.round(props.colorObj.blue)}</div>
							blue
						</div>
					</div>
				</div>

				<div className="app__type">
					<div className="hsl">
						<div className="btn-group" role="group" aria-label="">
							<a href="#" className="btn btn-secondary" data-type="h">Hue</a>
							<a href="#" className="btn btn-secondary" data-type="s">Saturation</a>
							<a href="#" className="btn btn-secondary" data-type="l">Lightness</a>
						</div>
					</div>

					<div className="rgb">
						<div className="btn-group" role="group" aria-label="">
							<a href="#" className="btn btn-secondary" data-type="r">Red</a>
							<a href="#" className="btn btn-secondary" data-type="g">Green</a>
							<a href="#" className="btn btn-secondary" data-type="b">Blue</a>
						</div>
					</div>
					<div className="steps">
						<span className="fa fa-th" />
						<input type="text" className="form-control input-steps" placeholder="steps"
							   defaultValue={props.steps} />
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
