cmu = _.extend(cmu, {
	isInt: function (value) {
		var er = /^-?[0-9]+$/;
		return er.test(value);
	},

	rgb2hex: function (rgb) {
		rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		function hex(x) {
			return ('0' + parseInt(x, 10).toString(16)).slice(-2);
		}

		return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	},

	validHex: function (hex) {
		return hex.match(new RegExp('[0-9A-Fa-f]', 'g'));
	},

	truncateDecimals: function (number, digits) {
		var multiplier = Math.pow(10, digits),
			adjustedNum = number * multiplier,
			truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

		return truncatedNum / multiplier;
	},

	getRandomInt: function (min, max) {
		return parseInt(Math.floor(Math.random() * (max - min + 1)) + min, 10);
	}
});
