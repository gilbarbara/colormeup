import React from 'react';
import PropTypes from 'prop-types';
import { getColorModes } from 'modules/helpers';

import { setOptions } from 'actions';

import Slider from './Slider';

export default class Sliders extends React.PureComponent {
  static propTypes = {
    color: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
  };

  handleClickSliderMenu = ({ currentTarget }) => {
    const { dispatch } = this.props;

    dispatch(setOptions({ model: currentTarget.dataset.model }));
  };

  getSliderValue(type) {
    const { color: { instance } } = this.props;
    let value = '';

    switch (type.key) {
      case 'h': {
        value = instance.lightness === 0 || instance.saturation === 0 ? 0 : instance.hue;
        break;
      }
      case 's': {
        value = instance.lightness === 0 ? 0 : instance.saturation;
        break;
      }
      case 'l': {
        value = instance.lightness;
        break;
      }
      default: {
        value = instance[type.slug];
        break;
      }
    }

    return value;
  }

  render() {
    const { color: { instance, model }, dispatch } = this.props;
    const mode = getColorModes().find(d => d.name === model);

    return (
      <div className="app__sliders">
        <ul className="app__sliders__menu list-unstyled">
          <li className={model === 'hsl' ? 'active' : null}>
            <button data-model="hsl" onClick={this.handleClickSliderMenu}>HSL</button>
          </li>
          <li className={model === 'rgb' ? 'active' : null}>
            <button data-model="rgb" onClick={this.handleClickSliderMenu}>RGB</button>
          </li>
        </ul>
        <div className="app__sliders__list">
          {mode.types.map((d, i) => (
            <Slider
              key={i}
              instance={instance}
              data={{ ...d, value: this.getSliderValue(d) }}
              dispatch={dispatch}
            />
          ))}
        </div>
      </div>
    );
  }
}
