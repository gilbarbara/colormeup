import React from 'react';
import PropTypes from 'prop-types';
import InputSlider from 'react-input-slider';
import { isNumber } from 'modules/helpers';

import NumericField from 'components/NumericField';

import { push, replace } from 'actions';

export default class Slider extends React.PureComponent {
  state = {
    lastValue: 0,
  };

  static propTypes = {
    data: PropTypes.object.isRequired,
    dispatch: PropTypes.func.isRequired,
    instance: PropTypes.object.isRequired,
  };

  handleChangeSlider = (pos) => {
    const { lastValue } = this.state;
    const { instance, data, dispatch } = this.props;
    const hex = instance.remix({ [data.key]: Math.round(pos.x) }, true);

    this.setState({
      lastValue: pos.x,
    }, () => {
      if (lastValue !== this.state.lastValue) {
        dispatch(replace(`/${hex}`));
      }
    });
  };

  handleChangeInput = (data) => {
    const { instance, dispatch } = this.props;

    if (isNumber(data.value)) {
      const hex = instance.remix({ [data.name]: data.value }, true);
      dispatch(push(`/${hex}`));
    }
  };

  render() {
    const { lastValue } = this.state;
    const { data } = this.props;
    const value = lastValue === 360 ? lastValue : data.value;

    return (
      <div className="app__slider">
        <span className="range-name">{data.name}</span>
        <InputSlider
          className="slider"
          data-type={data.key}
          x={value}
          xmax={data.max}
          onChange={this.handleChangeSlider}
        />
        <NumericField
          name={data.key}
          className="form-control"
          min={0}
          max={data.max}
          value={value}
          onChange={this.handleChangeInput}
        />
      </div>
    );
  }
}
