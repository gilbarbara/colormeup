//--todo double click on type change order

//todo double click on a color, lock it and add to the list
//todo color box with more info (HSL, RGB)
//todo click on color box, copy hex

var cmu = {
	name: 'colormeup',
	colorObj: null,
	color: null,
	defaultColors: [
		'#30d22b',
		'#f05350',
		'#443348',
		'#ff154c',
		'#fe7724',
		'#1e4d84',
		'#9bd615',
		'#4C2719',
		'#ffd200',
		'#ff0044'
	],
	readyUI: new $.Deferred(),
	hash: {},
	types: ['h', 's', 'l', 'r', 'g', 'b'],
	orders: ['asc', 'desc'],
	steps: 4,

	$app: $('.app'),
	$chooser: $('.app__header'),

	log: function () {
		if (location.hostname === 'localhost') {
			console.log(arguments);
		}
	},

	init: function () {
		this.log('init');

		this.setUI();
		this.readyUI.done(function () {
			this.getData();
			this.getHash();
			this.setEvents();
			this.setOptions();
			this.setStates();

			this.setColor();
			this.updateUI();
			this.buildBoxes();

			this.buildDefaultPalette();
			this.buildFavoritePalette();

			this.setPickerOptions();
		}.bind(this));
	},

	setOptions: function () {
		var settings = _.extend({
			type: 'h',
			order: 'desc',
			color: '',
			steps: this.steps
		}, this.hash);

		this.color = settings.color && this.validHex(settings.color) ? '#' + settings.color : (this.data.color ?this.getColors(1) : this.defaultColors[Math.floor(Math.random() * 6) + 1]);
		this.type = this.types.indexOf(settings.type) > -1 ? settings.type : 'h';
		this.order = this.orders.indexOf(settings.order) > -1 ? settings.order : 'desc';
		this.steps = settings.steps > 1 ? settings.steps : 4;

		this.log('setOptions', this);
	},

	setStates: function () {
		this.log('setStates');

		this.$chooser.find('.input-color').val(this.color.replace('#', ''));
		this.$chooser.find('.input-steps').val(this.steps);
		this.$app.find('.app__type [data-type=' + this.type + ']').addClass('active');
	},

	setValue: function (options) {
		this.log('setValue', options);
		if (options.color) {
			this.color = (options.color.indexOf('#') === -1 ? '#' : '') + options.color;
			this.setColor();
		}
		if (options.type) {
			this.type = options.type;
		}
		if (options.steps) {
			this.steps = options.steps;
		}

		this.setStates();
	},

	setColor: function () {
		this.log('setColor', this.color);
		this.colorObj = new Color(this.color);

		if (!this.isInt(this.colorObj.rgb.r) || !this.isInt(this.colorObj.rgb.g) || !this.isInt(this.colorObj.rgb.b)) {
			this.showAlert('Not a valid color');
			return false;
		}
		return true;
	},

	getColors: function (max) {
		this.log('getColors', max);
		var colors = this.data.colors.length ? this.data.colors : [],
			single = colors[Math.floor(Math.random() * colors.length)],
			range = colors.splice(0, max);

		return (!max ? colors : (max === 1 ? single : range));
	},

	addToList: function (color) {
		this.log('addToList', color);
		if (!this.validHex(color) || this.validHex(color).length !== 6) {
			this.showAlert('Not a valid color');
			return false;
		}

		if (this.data.colors.indexOf(color) === -1) {
			this.data.colors.push(color);

			if (this.data.colors.length === 1) {
				this.buildFavoritePalette();
			}
			else {
				this.appendToPalette(color);
			}

			this.setData();
		}
	},

	getData: function () {
		this.log('getData');
		this.data = JSON.parse(localStorage.getItem(this.name));
		if (!this.data) {
			this.data = {
				colors: []
			};
		}

		localStorage.setItem(this.name, JSON.stringify(this.data));
	},

	setData: function () {
		this.log('setData');
		this.data.lastVisit = +new Date();
		localStorage.setItem(this.name, JSON.stringify(this.data));
	},

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

	getHash: function () {
		this.log('getHash', this.hash);
		this.hash = _.extend(this.hash, $.deparam(location.hash.replace('#', '')));
	},

	setHash: function () {
		this.log('setHash');
		var options = {
			color: this.color.replace('#', ''),
			type: this.type
		};

		if (this.order !== 'desc') {
			options.order = this.order;
		}
		if (this.steps !== 4) {
			options.steps = this.steps;
		}
		this.hash = _.extend(this.hash, options);
		location.hash = $.param(this.hash);
	}
};

$(function () {
	cmu.init();
});
