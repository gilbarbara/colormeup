import React from 'react';

export default class Footer extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="app__footer">
				<a href="http://kollectiv.org/" target="_blank">
					<img src="media/kollectiv.svg" width="120" />
				</a>
				<a href="https://github.com/gilbarbara/colormeup" target="_blank">
					<img src="media/github.svg" width="50" />
				</a>
			</div>
		);
	}
}
