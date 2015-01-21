//--todo double click on type change order

//todo double click on a color, lock it and add to the list
//todo color box with more info (HSL, RGB)
//todo click on color box, copy hex
//todo hashchange on back/forward

var cmu = {
	name: 'colormeup',
	colorObj: null,
	color: null,
	defaultColors: [
		'#27bdbe',
		'#2bd2a3',
		'#5c4561',
		'#d5408b',
		'#f05350',
		'#4F86C6',
		'#E8871E',
		'#4C2719',
		'#f0f415',
		'#ff0044'
	],
	readyUI: new $.Deferred(),
	debug: function () {
		return (location.hostname === 'localhost');
	},
	hash: {},
	types: ['h', 's', 'l', 'r', 'g', 'b'],
	orders: ['asc', 'desc'],
	steps: 4,

	$app: $('.app'),
	$chooser: $('.app__header'),

	log: function () {
		if (this.debug()) {
			console.log(arguments);
		}
	},

	init: function () {
		this.log('init');

		this.renderUI();
		this.readyUI.done(function () {
			this.getHash();
			this.getData();

			this.setEvents();
			this.setOptions();
			this.setStates();
			this.setColor();
			this.buildDefaultPalette();
			this.buildFavoritePalette();

			if ('rgb'.indexOf(this.type) > -1) {
				this.buildRGBBoxes();
			}
			else if ('hsl'.indexOf(this.type) > -1) {
				this.buildHSLBoxes();
			}
		}.bind(this));
	},

	setOptions: function () {
		var settings = _.extend({
			type: 'h',
			order: 'desc',
			color: '',
			steps: this.steps
		}, this.hash);

		this.color = (settings.color && this.validHex(settings.color) ? '#' + settings.color : this.getColors(1));
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
			this.color = options.color;
			this.setColor();
		}
		if (options.type) {
			this.type = options.type;
		}
		if (options.steps) {
			this.steps = options.steps;
		}

		this.setStates();
		this.setHash();

		if ('rgb'.indexOf(this.type) > -1) {
			this.buildRGBBoxes();
		}
		else if ('hsl'.indexOf(this.type) > -1) {
			this.buildHSLBoxes();
		}
	},

	setColor: function () {
		this.log('setColor', this.color);
		this.colorObj = new Color(this.color);

		if (!this.isInt(this.colorObj.rgb.r) || !this.isInt(this.colorObj.rgb.g) || !this.isInt(this.colorObj.rgb.b)) {
			this.showAlert('Not a valid color');
			return false;
		}

		this.$chooser.css({
			backgroundColor: this.color,
			borderColor: this.darken(15)
		});

		if ($('html').hasClass('inlinesvg')) {
			$(this.$app.find('.logo svg'))
				.find('#color').css({
					fill: (this.colorObj.hsl.s > 8 ? (
						this.colorObj.hsl2hex({
							h: Math.abs(+this.colorObj.hsl.h + 90),
							s: (+this.colorObj.hsl.s < 30 ? Math.abs(+this.colorObj.hsl.s + 30) : +this.colorObj.hsl.s),
							l: (+this.colorObj.hsl.l < 35 ? +this.colorObj.hsl.l + 20 : +this.colorObj.hsl.l)
						})
					) : (+this.colorObj.hsl.l < 30 ? '#FFF' : '#333')),
					fillOpacity: (this.colorObj.hsl.s < 10 ? 0.6 : 1)
				}).end()
				.find('#me').css({
					fill: (this.colorObj.hsl.s > 8 ? (
						this.colorObj.hsl2hex({
							h: Math.abs(+this.colorObj.hsl.h + 180),
							s: (+this.colorObj.hsl.s < 30 ? Math.abs(+this.colorObj.hsl.s + 30) : +this.colorObj.hsl.s),
							l: (+this.colorObj.hsl.l < 35 ? +this.colorObj.hsl.l + 20 : +this.colorObj.hsl.l)
						})
					) : (+this.colorObj.hsl.l < 30 ? '#FFF' : '#333')),
					fillOpacity: (this.colorObj.hsl.s < 10 ? 0.4 : 1)
				}).end()
				.find('#up').css({
					fill: (this.colorObj.hsl.s > 8 ? (
						this.colorObj.hsl2hex({
							h: Math.abs(+this.colorObj.hsl.h + 270),
							s: (+this.colorObj.hsl.s < 30 ? Math.abs(+this.colorObj.hsl.s + 30) : +this.colorObj.hsl.s),
							l: (+this.colorObj.hsl.l < 35 ? +this.colorObj.hsl.l + 20 : +this.colorObj.hsl.l)
						})
					) : (+this.colorObj.hsl.l < 30 ? '#FFF' : '#333')),
					fillOpacity: (this.colorObj.hsl.s < 10 ? 0.2 : 1)
				}).end();
		}
		console.log(this.colorObj);

		this.$app.find('.app__color-info')
			.find('.color-h').html(this.truncateDecimals(this.colorObj.hue(), 2)).end()
			.find('.color-s').html(this.truncateDecimals(this.colorObj.saturation(), 2)).end()
			.find('.color-l').html(this.truncateDecimals(this.colorObj.lightness(), 2)).end()
			.find('.color-r').html(this.truncateDecimals(this.colorObj.red(), 2)).end()
			.find('.color-g').html(this.truncateDecimals(this.colorObj.green(), 2)).end()
			.find('.color-b').html(this.truncateDecimals(this.colorObj.blue(), 2));

	},

	getColors: function (max) {
		this.log('getColors', max);
		var colors = this.data.colors.length ? this.data.colors : this.defaultColors,
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
		this.hash = _.extend(this.hash, deparam(location.hash.replace('#', '')));
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
	},

	setEvents: function () {
		this.log('setEvents');
		$(document)
			.on('click', '.app__menu__list .items a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.$chooser.find('.input-color').val($this.data('color'));

				this.setValue({ color: '#' + $this.data('color') });
			}.bind(this))

			.on('click', '.app__type a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.log('.app__type a:click', $this);

				this.$app.find('.app__type a').removeClass('active');
				$this.addClass('active');

				this.setValue({ type: $this.data('type') });
			}.bind(this))

			.on('click', '.app__boxes a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.$chooser.find('.input-color').val($this.data('color'));

				this.setValue({ color: '#' + $this.data('color') });

				$('html, body').animate({ scrollTop: 0 }, 700, 'swing');

				//copy to clipboard
			}.bind(this))

			.on('click', '.color-picker', function (e) {
				e.preventDefault();
				this.$app.find('.color-picker').spectrum('option', 'color', this.color);
			})

			.on('click', '.save-color', function (e) {
				e.preventDefault();
				this.addToList(this.color);
			}.bind(this))

			.on('click', '.app__menu .close', function (e) {
				e.preventDefault();
				this.$app.find('.app__menu').animate({ right: -220 });
			}.bind(this))

			.on('keyup change', '.app__header .input-color', function (e) {
				var $this = $(e.target);
				if ([91, 37, 39].indexOf(e.keyCode) > -1) {
					return false;
				}

				//if (e.keyCode === 13 && $this.val().length === 3) {

				//todo validate hex and duplicate if 3
				//}

				var value = this.validHex($this.val().replace('#', '').substring(0, 6));

				var color = (value) ? value.join('') : '';

				$this.val(color);

				if (color.length === 6) {
					this.setValue({ color: '#' + color });
				}
			}.bind(this))

			.on('keyup change', '.app__header .input-steps', function (e) {
				var $this = $(e.target);

				if ($this.val().trim()) {
					var steps = parseInt($this.val(), 10);
					steps = steps > 0 ? steps : 1;

					$this.val(steps);
					this.setValue({ steps: steps });
				}

			}.bind(this))

			.on('move.spectrum', function (e, color) {
				this.setValue({ color: color.toHexString() });
			}.bind(this))

			.on('beforeShow.spectrum', function () {
				this.log('beforeShow');
				var colors = this.getColors(),
					palette = [],
					line = [],
					start = 0;

				while (start < colors.length) {
					if (start > 0 && start % 4 === 0) {
						palette.push(line);
						line = [];
					}
					line.push(colors[start]);
					start++;

					if ((Math.ceil(colors.length / 4) !== palette.length) && start === colors.length) {
						palette.push(line);
					}
				}

				this.$app.find('.color-picker').spectrum('set', this.color);
				this.$app.find('.color-picker').spectrum('option', 'palette', palette);
			}.bind(this))

			.on('dragstop.spectrum', function (e, color) {
				//this.addToHistory(color.toHexString());
				//this.$app.find('.color-picker').spectrum('hide');
			}.bind(this));
	}
};

$(function () {
	cmu.init();
});
