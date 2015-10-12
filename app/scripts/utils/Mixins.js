import React from 'react';

function mixins (...mixinFactories) {
	var base = class extends React.Component {};
	for (var i = 0; i < mixinFactories.length; i++) {
		base = mixinFactories[i](base);
	}
	return base;
}

export default mixins;
