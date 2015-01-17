//todo double click change order
//todo show input for steps

//todo add selected color to the list
//todo double click on a color, lock it and add to the list
//todo save list on localStorage,
//todo show list
//todo hashchange

var cmu = {
	colorObj: null,
	color: null,
	colors: [
		'#27bdbe',
		'#2bd2a3',
		'#5c4561',
		'#d5408b',
		'#f05350',
		'#4F86C6',
		'#E8871E',
		'#4C2719',
		'#F8FA90',
		'#ff0044'
	],
	types: ['h', 's', 'l'],
	orders: ['asc', 'desc'],

	init: function () {

		this.setOptions();

		this.$app = $('.app');
		this.$chooser = $('.app__chooser');
		this.$input = this.$chooser.find('input');

		this.setEvents();

		this.setStates();

		this.setColor();

		this.buildColors();
	},

	setOptions: function () {
		var settings = _.extend({
			type: 'h',
			order: 'desc',
			color: ''
		}, this.hash);

		this.color = (settings.color && this.validHex(settings.color) ? '#' + settings.color : this.colors[Math.floor(Math.random() * this.colors.length)]);
		this.type = this.types.indexOf(settings.type) > -1 ? settings.type : 'h';
		this.order = this.orders.indexOf(settings.order) > -1 ? settings.order : 'desc';
	},

	setStates: function () {
		this.$input.val(this.color.replace('#', ''));
		this.$app.find('.app__type [data-type=' + this.type + ']').addClass('active');
	},

	setColor: function () {
		console.log('setColor', this.color);
		this.colorObj = new Color(this.color);

		if (!this.isInt(this.colorObj.rgb.r) || !this.isInt(this.colorObj.rgb.g) || !this.isInt(this.colorObj.rgb.b)) {
			this.$app.find('.app__message').html('Not a valid color');
			return false;
		}

		this.$chooser.css({
			backgroundColor: this.color,
			borderColor: this.darken(15)
		});

		this.$chooser.find('h1').css({
			color: (this.colorObj.lightness() <= 50 ? this.changeLightness(70) : this.changeLightness(20))
		});

		this.$chooser.find('input').css({
			backgroundColor: this.lighten((90 - (+this.colorObj.lightness()))),
			borderColor: this.darken(15)
		});

		this.buildBoxes();
	},

	buildColors: function () {
		var colors = [];
		_.each(this.colors, function (d) {
			colors.push('<a href="#" data-color="' + d.replace('#', '') + '" style="background-color: ' + d + '"></a>');
		});

		this.$app.find('.app__palette').html(colors.join(''));
	},

	buildBoxes: function (options) {
		var settings = _.extend({
			max: (this.type === 'h' ? 356 : 96),
			factor: 4,
			h: 'changeHue',
			s: 'changeSaturation',
			l: 'changeLightness'
		}, options);

		var max = (this.type === 'h' ? cmu.colorObj.hue() : (this.order === 'desc' ? settings.max : 0)),
			boxes = [],
			color,
			textColor;

		while (this.order === 'desc' ? max > 0 : max <= settings.max) {
			color = this[settings[this.type]](max);

			textColor = new Color(color);
			console.log(textColor.hex, textColor.hsl.l);
			textColor = textColor.hsl2hex({ h: textColor.hsl.h, s: 0, l: (+textColor.hsl.l + 40 > 100 ? Math.abs(40 - +textColor.hsl.l) : +textColor.hsl.l + 40) });

			boxes.push('<div style="background-color: ' + color + '"><div class="box__hex" style="color: ' + textColor + ';">' + color + '</div></div>');

			max = (this.order === 'desc' ? max - settings.factor : max + settings.factor);
		}
		console.log('buildBoxes:afterloop', this.order, max, cmu.colorObj.hue());
		if (this.type === 'h') {
			max = (this.order === 'asc' ? 0 : 360);

			while (this.order === 'desc' ? max > cmu.colorObj.hue() : max <= cmu.colorObj.hue()) {
				color = this[settings[this.type]](max);
				textColor = new Color(color);
				textColor = textColor.hsl2hex({ h: textColor.hsl.h, s: 0, l: (+textColor.hsl.l + 40 > 100 ? Math.abs(40 - +textColor.hsl.l) : +textColor.hsl.l + 40) });
				boxes.push('<div style="background-color: ' + color + '"><div class="box__hex" style="color: ' + textColor + ';">' + color + '</div></div>');

				max = (this.order === 'desc' ? max - settings.factor : max + settings.factor);
			}
			console.log('buildBoxes hue loop again', cmu.colorObj.hue(), max);
		}

		this.$app.find('.app__boxes').html('').append(boxes);
	},

	changeLightness: function (val) {
		return this.colorObj.hsl2hex({h: this.colorObj.hsl.h, s: this.colorObj.hsl.s, l: val});
	},

	changeSaturation: function (val) {
		return this.colorObj.hsl2hex({h: this.colorObj.hsl.h, s: val, l: this.colorObj.hsl.l});
	},

	changeHue: function (val) {
		return this.colorObj.hsl2hex({h: val, s: this.colorObj.hsl.s, l: this.colorObj.hsl.l});
	},

	lighten: function (val) {
		return Transforms.lighten(this.colorObj, val);
	},

	darken: function (val) {
		return Transforms.darken(this.colorObj, val);
	},

	isInt: function (value) {
		var er = /^-?[0-9]+$/;
		return er.test(value);
	},

	validHex: function (hex) {
		return hex.match(new RegExp('[0-9A-Fa-f]', 'g'));
	},

	getHash: function () {
		console.log('getHash', this.hash, this.color);
		this.hash = _.extend(this.hash, deparam(location.hash.replace('#', '')));

		this.setOptions();
		this.setStates();
		this.buildBoxes();

	},

	setHash: function () {
		var options = {
			color: this.color.replace('#', ''),
			type: this.type
		};

		if (this.order !== 'desc') {
			options.order = this.order;
		}
		this.hash = _.extend(this.hash, options);
		location.hash = $.param(this.hash);
	},

	setEvents: function () {

		$(document)
			.on('click', '.app__palette a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.$input.val($this.data('color'));

				this.color = '#' + $this.data('color');
				this.setHash();
				this.setColor();
			}.bind(this))

			.on('click', '.app__type a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				console.log('.app__type a:click', $this);

				this.type = $this.data('type');

				$this.addClass('active').siblings().removeClass('active');
				this.setHash();
				this.buildBoxes();
			}.bind(this))

			.on('keyup change', '.app__chooser input', function (e) {
				var $this = $(e.target);
				console.log(e.keyCode, e.metaKey);
				if ([91, 37, 39].indexOf(e.keyCode) > -1) {
					return false;
				}

				var value = this.validHex($this.val().replace('#', '').substring(0, 6));
				console.log('on:keyup', value);
				var color = (value) ? value.join('') : '';

				$this.val(color);

				if (color.length === 6) {
					this.color = '#' + color;
					this.setHash();
					this.setColor();
				}

			}.bind(this));
	}
};

$(function () {
	cmu.hash = deparam(location.hash.replace('#', ''));
	cmu.init();
});
