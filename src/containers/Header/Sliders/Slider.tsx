import { useState } from 'react';
import RangeSlider, { RangeSliderPosition } from '@gilbarbara/react-range-slider';

import NumericInput, { NumericInputOnChangeParameter } from '~/components/NumericInput';

import { HSLProperty, RGBProperty } from '~/types';

import styles from './Sliders.module.css';

interface SliderProps {
  max: number;
  name: string;
  onChangeInput: (item: NumericInputOnChangeParameter) => void;
  onSliderChange: (type: HSLProperty | RGBProperty, value: number) => void;
  type: HSLProperty | RGBProperty;
  value: number;
}

function Slider(props: SliderProps) {
  const { max, name, onChangeInput, onSliderChange, type, value } = props;

  const [lastValue, setLastValue] = useState(0);

  const handleChangeSlider = ({ x }: RangeSliderPosition) => {
    onSliderChange(type, x);

    setLastValue(x);
  };

  const nextValue = lastValue === 360 ? lastValue : value;

  return (
    <div className={styles.sliderMain} data-component-name="Slider">
      <div className={styles.sliderName}>{name}</div>
      <RangeSlider
        data-type={type}
        onChange={handleChangeSlider}
        styles={{
          options: {
            height: 10,
            rangeColor: '#aaa',
            thumbBorderRadius: 8,
            thumbBorder: 0,
            thumbColor: '#888',
            thumbSize: 12,
            thumbSpace: 2,
            trackBorderRadius: 8,
            trackColor: '#ccc',
          },
        }}
        x={nextValue}
        xMax={max}
      />
      <NumericInput max={max} min={0} name={type} onChange={onChangeInput} value={nextValue} />
    </div>
  );
}

export default Slider;
