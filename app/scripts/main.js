var cmu = {
  color: null,
  selectedColor: null,
  colors: [
    '#ff0044',
    '#FF6CFF',
    '#00FF7D',
    '#F0843A',
    '#FF2C1E'
  ],
  init: function () {
    this.$body = $('body');
    this.$chooser = $('#color-chooser');
    this.$input = this.$chooser.find('input');

    this.color = this.colors[Math.floor(Math.random()*this.colors.length)];

    this.$input.val(this.color.replace('#', ''));
    this.setColor(this.color);

    this.events();
  },

  setColor: function (color) {
    this.selectedColor = color;
    this.color = new Color(color);


    this.$body.find('.app').css({
      backgroundColor: color,
      borderColor: Transforms.darken(this.color, (85 - (+this.color.hsl.l)))
    });
    this.$chooser.find('input').css({
      backgroundColor: Transforms.lighten(this.color, (90 - (+this.color.hsl.l))),
      borderColor: Transforms.darken(this.color, (75 - (+this.color.hsl.l)))
    });


    this.selectedColor = color;
    this.color = new Color(color);
    console.log(this.color);
  },

  events: function () {
    this.$input.on('keyup', function (e) {
      var $this = $(e.target);

      $this.val($this.val().replace('#', ''));
      this.setColor($this.val());
    }.bind(this));
  }
};

$(function () {
	cmu.init();
});
