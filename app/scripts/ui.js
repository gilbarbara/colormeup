cmu = _.extend(cmu, {
	renderUI: function () {
		this.log('renderUI');

		this.$app.find('.color-picker').spectrum({
			showPalette: true
		});

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
		this.$app.find('.app__menu__list.default .items').html(defaultColors.join(''));

	},

	buildFavoritePalette: function () {
		var colors = [];
		if (this.data.colors) {
			_.each(this.getColors(), function (d) {
				colors.push('<a href="#" data-color="' + d.replace('#', '') + '" style="background-color: ' + d + '"></a>');
			});
		}

		this.$app.find('.app__menu__list.favorites').show().find('.items').html(colors.join(''));
	},

	appendToPalette: function (color) {
		this.$app.find('.app__menu__list.favorites .items').append('<a href="#" data-color="' + color.replace('#', '') + '" style="background-color: ' + color + '"></a>');
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

	buildBox: function (color) {
		var textColor = this.textLightness(color);
		return '<a href="#" data-color="' + color.replace('#', '') + '" style="background-color: ' + color + '"><div class="box__hex" style="color: ' + textColor + ';">' + color + '</div></a>';
		//todo add <span class="glyphicon glyphicon-copy"></span>
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
	}
});
