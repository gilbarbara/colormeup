cmu = _.extend(cmu, {
	setUI: function () {
		this.log('setUI');

		window.pickers = this.$app.find('.app__picker').spectrum({
			flat: true,
			showButtons: false,
			showPalette: true,
			hideAfterPaletteSelect: true
		});

		this.buildDefaultPalette();
		if (this.data.starter) {
			this.$app.find('.app__sidebar__list.default').show();
		}
		else {
			this.$app.find('.app__sidebar__list .restore-starter').show();
		}

		if (this.data.help) {
			this.$app.find('.app__sidebar__list.help .text').show();
		}

		if ($('html').hasClass('inlinesvg')) {
			return $.get('media/colormeup.svg',
				function (svgDoc) {
					var importedSVGRootElement = document.importNode(svgDoc.documentElement, true);
					$('.logo').append(importedSVGRootElement);

					this.readyUI.resolve();
				}.bind(this), 'xml');
		}
		else {
			this.readyUI.resolve();
		}
	},

	updateUI: function () {
		var exports = {
			hex: this.colorObj.hex,
			hsl: 'hsl(' + parseInt(this.colorObj.hsl.h, 10) + ', ' + parseInt(this.colorObj.hsl.s, 10) + '%' + ', ' + parseInt(this.colorObj.hsl.l, 10) + '%' + ')',
			rgb: 'rgb(' + this.colorObj.rgb.r + ', ' + this.colorObj.rgb.g + ', ' + this.colorObj.rgb.b + ')'
			},
			currentColor = (this.colorObj.hsl.s > 8 ? (
				this.colorObj.hsl2hex({
					h: Math.abs(+this.colorObj.hsl.h + 90),
					s: (+this.colorObj.hsl.s < 30 ? Math.abs(+this.colorObj.hsl.s + 30) : +this.colorObj.hsl.s),
					l: (+this.colorObj.hsl.l < 35 ? +this.colorObj.hsl.l + 20 : +this.colorObj.hsl.l)
				})
			) : (+this.colorObj.hsl.l < 30 ? '#FFF' : '#333'));

		this.log('updateUI', this.color);
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

		this.$app.find('.app__toggle .navigation-toggle-icon, .app__sidebar__list > a').css({
			color: currentColor
		}).attr('data-color', currentColor);

		this.$app.find('.app__info')
			.find('.color-h').html(parseInt(this.colorObj.hue(), 10)).end()
			.find('.color-s').html(parseInt(this.colorObj.saturation(), 10) + '%').end()
			.find('.color-l').html(parseInt(this.colorObj.lightness(), 10) + '%').end()
			.find('.color-r').html(this.colorObj.red()).end()
			.find('.color-g').html(this.colorObj.green()).end()
			.find('.color-b').html(this.colorObj.blue());

		this.buildBoxes();

		$('.app-overlay').css({ backgroundColor: this.transparentize(0.3) });

		this.$app.find('.app__sidebar__list.export')
			.find('.hex-copy')
			.find('span').text(exports.hex).end()
			.find('a').attr('data-clipboard-text', exports.hex).end().end()

			.find('.rgb-copy')
			.find('span').text(exports.rgb).end()
			.find('a').attr('data-clipboard-text', exports.rgb).end().end()

			.find('.hsl-copy')
			.find('span').text(exports.hsl).end()
			.find('a').attr('data-clipboard-text', exports.hsl);

		this.$app.find('.app__sidebar__list.help h5').css('color', (this.colorObj.lightness() < 20 ? '#fff' : this.color));
	},

	setPickerOptions: function () {

		var colors = this.getColors();

		this.log('setPickerOptions', colors);

		this.$app.find('.app__picker').spectrum('option', 'palette', colors);
		this.$app.find('.app__picker').spectrum('option', 'color', this.color);
		this.$app.find('.app__picker').spectrum('set', this.color);

		this.$app.find('.app__picker').spectrum('reflow');
	},

	showAlert: function (msg) {
		this.$app.find('.app__message').html(msg).fadeIn();

		setTimeout(function () {
			this.$app.find('.app__message').fadeOut(function () {
				$(this).html('');
			});
		}.bind(this), 2500);
	},

	buildDefaultPalette: function () {
		var defaultColors = [];
		_.each(this.defaultColors, function (d) {
			defaultColors.push('<a href="#" data-color="' + d.replace('#', '') + '" style="background-color: ' + d + '"></a>');
		});
		this.$app.find('.app__sidebar__list.default')
			.find('.items').html(defaultColors.join(''));

	},

	buildFavoritePalette: function () {
		var colors = [];
		if (this.data.colors) {
			_.each(this.getColors(), function (d) {
				colors.push('<a href="#" data-color="' + d.replace('#', '') + '" style="background-color: ' + d + '"></a>');
			});
		}

		if (colors.length) {
			this.$app.find('.app__sidebar__list.favorites').show().find('.items').html(colors.join(''));
		}
	},

	appendToPalette: function (color) {
		this.$app.find('.app__sidebar__list.favorites .items').show().append('<a href="#" data-color="' + color.replace('#', '') + '" style="background-color: ' + color + '"></a>');
	},

	buildBoxes: function () {
		if ('rgb'.indexOf(this.type) > -1) {
			this.buildRGBBoxes();
		}
		else if ('hsl'.indexOf(this.type) > -1) {
			this.buildHSLBoxes();
		}
	},

	buildBox: function (color) {
		var textColor = this.textLightness(color);
		return '<a href="#" data-color="' + color.replace('#', '') + '" style="background-color: ' + color + '"><div class="app__box" style="color: ' + textColor + ';">' + color + '</div></a>';
		//todo add <span class="glyphicon glyphicon-copy"></span>
	},

	buildHSLBoxes: function (options) {
		var settings = _.extend({
			max: (this.type === 'h' ? 356 : 96),
			steps: this.steps
		}, options);

		this.log('buildHSLBoxes', 'type:', this.type, this.color, this.colorObj.hsl);

		var max = (this.type === 'h' ? cmu.colorObj.hue() : (this.order === 'desc' ? settings.max : 0)),
			boxes = [];

		while (this.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeHSLValue(max, (this.type === 's' && +this.colorObj.hsl.s === 0 ? 'l' : this.type))));

			max = (this.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		if (this.type === 'h') {
			max = (this.order === 'desc' ? 360 : 0);

			while (this.order === 'desc' ? max > cmu.colorObj.hue() : max <= cmu.colorObj.hue()) {
				boxes.push(this.buildBox(this.changeHSLValue(max, (this.type === 's' && +this.colorObj.hsl.s === 0 ? 'l' : this.type))));

				max = (this.order === 'desc' ? max - settings.steps : max + settings.steps);
			}
			this.log('buildHSLBoxes: hue extra loop', cmu.colorObj.hue(), max);
		}

		this.$app.find('.app__boxes').html('').append(boxes);
	},

	buildRGBBoxes: function (options) {
		var settings = _.extend({
			max: 255,
			steps: this.steps
		}, options);

		this.log('buildRGBBoxes', 'type:', this.type, this.color, this.colorObj.rgb);

		var max = (this.order === 'desc' ? settings.max : 0),
			boxes = [];

		while (this.order === 'desc' ? max > 0 : max <= settings.max) {
			boxes.push(this.buildBox(this.changeRGBValue(max, this.type)));

			max = (this.order === 'desc' ? max - settings.steps : max + settings.steps);
		}

		this.$app.find('.app__boxes').html('').append(boxes);
	},

	textLightness: function (color) {
		var thisColor = new Color(color);
//(type === 'h' ? (+thisColor.hsl.h + 180 > 360 ? Math.abs(180 - +thisColor.hsl.h) : +thisColor.hsl.h + 180) : thisColor.hsl.h)
		return thisColor.hsl2hex({
			h: thisColor.hsl.h,
			s: thisColor.hsl.s,
			l: (+thisColor.hsl.l + 40 > 100 ? Math.abs(40 - +thisColor.hsl.l) : +thisColor.hsl.l + 40)
		});
	},

	changeHSLValue: function (val, type) {
		//this.log('changeValue', val, type);
		return this.colorObj.hsl2hex({
			h: (type === 'h' ? val : this.colorObj.hsl.h),
			s: (type === 's' ? val : this.colorObj.hsl.s),
			l: (type === 'l' ? val : this.colorObj.hsl.l)
		});
	},

	changeRGBValue: function (val, type) {
		//this.log('changeRGBValue', val, type);
		return this.colorObj.rgb2hex({
			r: type === 'r' ? val : this.colorObj.rgb.r,
			g: type === 'g' ? val : this.colorObj.rgb.g,
			b: type === 'b' ? val : this.colorObj.rgb.b
		});
	},

	lighten: function (val) {
		return Transforms.lighten(this.colorObj, val);
	},

	darken: function (val) {
		return Transforms.darken(this.colorObj, val);
	},

	transparentize: function (amount, degree) {
		var color = new Color(this.colorObj.hsl2hex({
			h: Math.abs(+this.colorObj.hsl.h + (degree ? degree : 90)),
			s: this.colorObj.hsl.s,
			l: this.colorObj.hsl.l
		}));

		return 'rgba(' + color.red() + ', ' + color.green() + ', ' + color.blue() + ', ' + amount + ')';
	}
});
