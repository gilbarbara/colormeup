import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

export default class Boxes extends React.Component {
  static propTypes = {
    color: PropTypes.object.isRequired,
  };

  handleClick = () => {
    if (document.body.scrollTop > 150) {
      $('html, body').animate({ scrollTop: 0 }, 500, 'swing');
    }
  };

  textColor(hsl) {
    const { color } = this.props;

    return color.instance.hsl2hex({
      ...hsl,
      l: (hsl.l + 40 > 90 ? Math.abs(50 - hsl.l) : hsl.l + 40),
    });
  }

  changeHSLValue(opts) {
    const { color } = this.props;
    const colors = {};

    colors.hsl = {
      ...color.instance.hsl,
      ...opts,
    };
    colors.rgb = color.instance.hsl2rgb(colors.hsl);
    colors.hex = color.instance.hsl2hex(colors.hsl);

    return colors;
  }

  changeRGBValue(opts) {
    const { color } = this.props;
    const colors = {};

    colors.rgb = {
      ...color.instance.rgb,
      ...opts,
    };
    colors.hsl = color.instance.rgb2hsl(colors.rgb);
    colors.hex = color.instance.rgb2hex(colors.rgb);

    return colors;
  }

  renderHSLBoxes(options) {
    const {
      color: {
        instance,
        steps,
        type,
      },
    } = this.props;

    const settings = {
      max: (type === 'h' ? 360 : 100),
      steps,
      ...options,
    };
    const rate = settings.max / settings.steps;
    const boxes = [];

    let value = instance.hsl[type];

    if (type !== 'h') {
      while (value < settings.max) {
        value += rate;
      }
      value -= rate;
    }

    for (let i = 0; i < settings.steps; i++) {
      boxes.push(this.renderBox(this.changeHSLValue({ [type]: value < 0 ? 0 : value })));

      if (type === 'h') {
        value += rate;

        if (value > settings.max) {
          value += -settings.max;
        }
      }
      else {
        value -= rate;
      }
    }

    return boxes;
  }

  renderRGBBoxes(options) {
    const {
      color: {
        instance,
        steps,
        type,
      },
    } = this.props;

    const settings = {
      max: 255,
      ...options,
    };
    const rate = settings.max / steps;
    const boxes = [];
    let value = instance.rgb[type];

    while (value < settings.max) {
      value += rate;
    }
    value -= rate;

    for (let i = 0; i < steps; i++) {
      boxes.push(this.renderBox(this.changeRGBValue({ [type]: Math.round(value) })));
      value -= rate;
    }

    return boxes;
  }

  renderBox({ hex }) {
    const { color: { instance } } = this.props;

    return (
      <Link
        key={`${hex}-${Math.random()}`}
        to={`/${hex}`}
        style={{ backgroundColor: hex }}
        onClick={this.handleClick}
      >
        <span className="app__box" style={{ color: instance.textColor(hex) }}>
          {hex}
        </span>
      </Link>
    );
  }

  render() {
    const { color } = this.props;
    let output = [];

    if ('rgb'.indexOf(color.type) > -1) {
      output = this.renderRGBBoxes();
    }
    else if ('hsl'.indexOf(color.type) > -1) {
      output = this.renderHSLBoxes();
    }

    return (
      <div className="app__boxes">{output}</div>
    );
  }
}
