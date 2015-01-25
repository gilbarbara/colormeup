cmu = _.extend(cmu, {
	setEvents: function () {
		this.log('setEvents');
		$(document)
			.on('click', '.app__header svg #color, .app__header svg #me, .app__header svg #up', function (e) {
				var $this = $(e.currentTarget);

				this.$chooser.find('.input-color').val(this.rgb2hex($this.css('fill')));

				this.log('Click: logo');

				this.setValue({ color: this.rgb2hex($this.css('fill')) });
				this.setPickerOptions();
				this.setHash();

			}.bind(this))

			.on('change', '.app__toggle .navigation-checkbox', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.log('Click: .app__toggle');

				if (this.$app.find('.sp-container').is(':visible') && $this.is(':checked')) {
					this.$app.find('.color-picker').trigger('click');
				}
				this.$app.find('.app__sidebar').toggleClass('visible');
				$('.app-overlay').toggleClass('visible');

			}.bind(this))

			.on('click', '.app__sidebar__list .erase-favorites', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.log('Click: .app__sidebar__list.favorites reset');

				$this.parents('.app__sidebar__list.favorites').slideUp(function () {
					$(this).find('.items').html('');
				});
				this.data.colors = [];
				this.setData();

			}.bind(this))

			.on('click', '.app__sidebar__list .help-toggle', function (e) {
				e.preventDefault();
				this.log('Click: .app__sidebar__list.help toggle');

				this.$app.find('.app__sidebar__list.help .text').slideToggle();
				this.data.help = !this.data.help;
				this.setData();

			}.bind(this))

			.on('click', '.app__sidebar__list .hide-starter', function (e) {
				e.preventDefault();
				this.log('Click: .app__sidebar__list.default hide');

				this.$app.find('.app__sidebar__list.default').slideUp();
				this.data.starter = false;
				this.setData();

			}.bind(this))

			.on('click', '.app__sidebar__list .restore-starter', function (e) {
				e.preventDefault();
				this.log('Click: .app__sidebar__list.default restore');

				this.$app.find('.app__sidebar__list.default').slideDown();
				this.data.starter = true;
				this.setData();

			}.bind(this))

			.on('click', '.app__type a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.log('Click: .app__type a', $this);

				this.$app.find('.app__type a').removeClass('active');
				$this.addClass('active');
				
				this.setValue({
					type: $this.data('type'),
					steps: (+this.steps > this.typeSteps[$this.data('type')].max ? this.typeSteps[$this.data('type')].optimal : (+this.steps === this.typeSteps[this.type].optimal ? this.typeSteps[$this.data('type')].optimal : +this.steps))
				});
				this.setHash();
			}.bind(this))

			.on('click', '.color-picker', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget),
					$info = this.$app.find('.app__info .rgb'),
					$picker = this.$app.find('.sp-container');

				$picker.css({
					top: ($this.offset().left + 20 > $picker.width() ? $this.offset().top : ($info.offset().top + $info.outerHeight() + 15)),
					left: ($this.offset().left + 20 > $picker.width() ? ($this.offset().left - $picker.width()) - 10 : $this.offset().left)
				}).fadeToggle();

				if (this.$app.find('.app__sidebar').hasClass('visible')) {
					this.$app.find('.app__toggle  .navigation-checkbox').trigger('click');
				}

				$picker.show();
				this.setPickerOptions();

			}.bind(this))

			.on('click', '.save-color', function (e) {
				e.preventDefault();
				this.addToList(this.color);
				this.setPickerOptions();
			}.bind(this))

			.on('click', '.app__boxes a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.$chooser.find('.input-color').val($this.data('color'));

				this.setValue({ color: '#' + $this.data('color') });
				this.setPickerOptions();
				this.setHash();

				$('html, body').animate({ scrollTop: 0 }, 700, 'swing');

				//todo copy to clipboard
			}.bind(this))

			.on('click', '.app__sidebar__list .items a', function (e) {
				e.preventDefault();
				var $this = $(e.currentTarget);

				this.$chooser.find('.input-color').val($this.data('color'));

				this.setValue({ color: '#' + $this.data('color') });
				this.setHash();
				this.setPickerOptions();

				this.$app.find('.app__toggle  .navigation-checkbox').trigger('click');
			}.bind(this))

			.on('click', '.app-overlay', function () {
				this.$app.find('.app__toggle  .navigation-checkbox').trigger('click');
			}.bind(this))

			.on('click', '.copy-button', function (e) {
				e.preventDefault();
			})

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
					this.setHash();
				}
			}.bind(this))

			.on('keyup change', '.app__header .input-steps', function (e) {
				var $this = $(e.target);

				if ($this.val().trim()) {
					var steps = parseInt($this.val(), 10);

					steps = steps > 0 ? steps : 1;
					steps = steps > this.typeSteps[this.type].max ? this.typeSteps[this.type].max : steps;

					$this.val(steps);
					this.setValue({ steps: steps });
					this.setHash();
				}

			}.bind(this))

			.on('keypress', function (e) {
				if (e.target.tagName === 'BODY') {
					e.preventDefault();

					var factor = 36,
						lightness = this.getRandomInt(Math.abs(+this.colorObj.hsl.l - factor), Math.abs(+this.colorObj.hsl.l + factor));

					var color = this.colorObj.hsl2hex({
						h: this.getRandomInt(0, 360), //this.getRandomInt(Math.abs(+this.colorObj.hsl.h - factor), Math.abs(+this.colorObj.hsl.h + factor))
						s: this.colorObj.hsl.s, // this.getRandomInt(Math.abs(+this.colorObj.hsl.s - factor), Math.abs(+this.colorObj.hsl.s + factor))
						l: this.colorObj.hsl.s // (lightness > 20 || lightness < 80 ? lightness : this.colorObj.hsl.l)
					});

					this.setValue({ color: color });
					this.setHash();
				}
			}.bind(this))

			.on('move.spectrum', function (e, color) {
				this.setValue({ color: color.toHexString() });
				this.updateUI();
			}.bind(this))

			.on('dragstop.spectrum', function (e, color) {
				this.setValue({ color: color.toHexString() });
				this.setHash();
				//this.addToHistory(color.toHexString());
				//this.$app.find('.app__picker').spectrum('hide');
			}.bind(this));

		$(window).hashchange(function () {
			this.getHash();

			this.setValue(this.hash);
			this.updateUI();

		}.bind(this));

		var clipboard = new ZeroClipboard(document.getElementsByClassName('copy-button'));

		clipboard.on('aftercopy', function (event) {
			this.log('aftercopy', event.data['text/plain']);
			// `this` === `client`
			// `event.target` === the element that was clicked
		}.bind(this));
	}
});
