import React from 'react';

export default class Sidebar extends React.Component {
	constructor (props) {
		super(props);
		this.state = {};
	}

	render () {
		return (
			<div className="app__sidebar">
				<div className="app__sidebar__list default">
					<h3>starter kit<a href="#" title="Hide this kit" className="hide-starter reset"><span className="glyphicon glyphicon-eye-close"/></a></h3>
					<div className="items"></div>
				</div>

				<div className="app__sidebar__list favorites">
					<h3>your favorites<a href="#" title="Erase your favorites" className="erase-favorites reset"><span className="glyphicon glyphicon-trash"/></a></h3>
					<div className="items"></div>
				</div>

				<div className="app__sidebar__list export">
					<h3><a href="#" className="toggle">values</a></h3>
					<div className="code">
						<div className="hex-copy clearfix"><span></span><a href="#" data-clipboard-text="copy-me" className="copy-button"><i className="glyphicon glyphicon-copy"/></a></div>
						<div className="rgb-copy clearfix"><span></span><a href="#" data-clipboard-text="copy-me" className="copy-button"><i className="glyphicon glyphicon-copy"/></a></div>
						<div className="hsl-copy clearfix"><span/><a href="#" data-clipboard-text="copy-me" className="copy-button"><i className="glyphicon glyphicon-copy"/></a></div>
					</div>
				</div>

				<div className="app__sidebar__list help">
					<h3><a href="#" className="toggle"><span className="glyphicon glyphicon-question-sign"/> Help</a></h3>
					<div className="text">
						<h5>Know thy color!</h5>
						<p>colormeup is a tool to inspect a color and play with its many variations in Hue (0-360), Saturation and Lightness (0-100) and also RGB (0-255).
						</p>
						<p><span className="glyphicon glyphicon-expand"/> change the steps to get a different number of colors</p>
						<p><span className="glyphicon glyphicon-tint"/> open the color picker</p>
						<p><span className="glyphicon glyphicon-heart"/> save to your favorites</p>
						<p className="restore-starter"><a href="#" className="btn btn-default btn-xs">Restore starter kit</a> </p>
					</div>
				</div>
			</div>
		);
	}
}
