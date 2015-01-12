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
  init: function () {
    this.$body = $('body');
    this.$chooser = $('.app__chooser');
    this.$input = this.$chooser.find('input');

    this.color = this.colors[Math.floor(Math.random() * this.colors.length)];

    this.$input.val(this.color.replace('#', ''));
    this.setColor(this.color);

    this.buildColors();

    this.events();
  },

  setColor: function (color) {
    this.color = color;
    this.colorObj = new Color(color);
    this.lightenMax = Math.floor(100 - this.colorObj.lightness());
    this.darkenMax = Math.floor(this.colorObj.lightness());

    if (!this.isInt(this.colorObj.rgb.r) || !this.isInt(this.colorObj.rgb.g) || !this.isInt(this.colorObj.rgb.b)) {
      this.$body.find('.message').html('Not a valid color');
      return false;
    }

    this.$body.find('.app__chooser').css({
      backgroundColor: color,
      borderColor: this.darken(15)
    });

    this.$chooser.find('h1').css({
      color: (this.colorObj.lightness() <=50 ? this.changeLightness(70) : this.changeLightness(20))
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
      colors.push('<a href="#" data-color="' + d.replace('#', '') + '" style="background-color: ' + d + '"></a>')
    });

    this.$body.find('.app__colors').html(colors.join(''));
  },

  buildBoxes: function () {
    var s = 96,
        boxes = [],
        hex;

    while (s > 0) {
      hex = this.changeLightness(s);
      textColor = this.changeLightness(s < 50 ? 80 : 20);
      boxes.push('<div style="background-color: ' + hex + '"><div class="box__hex" style="color: ' + textColor + ';">' + hex + '</div></div>');

      s = s - 4;
    }

    this.$body.find('.app__boxes').html('').append(boxes);

  },

  changeLightness: function (l) {
    return this.colorObj.hsl2hex({ h: this.colorObj.hsl.h, s: this.colorObj.hsl.s, l: l });
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

  events: function () {
    $(document).on('click', '.app__colors a', function (e) {
      e.preventDefault();
      var $this = $(e.currentTarget);

      e = $.Event("keyup");
      e.which = 13;
      this.$input.val($this.data('color')).trigger(e);
    }.bind(this));

    this.$input.on('keyup change', function (e) {
      var $this = $(e.target);

      var value = this.validHex($this.val().replace('#', '').substring(0, 6));
      var color = (value) ? value.join('') : '';

      $this.val(color);
      if (color.length === 6) {
        this.setColor('#' + color);
      }

    }.bind(this));
  }
};

$(function () {
  cmu.init();
});
