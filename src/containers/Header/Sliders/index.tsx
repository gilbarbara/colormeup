import { memo, MouseEvent, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { omit } from '@gilbarbara/helpers';
import clsx from 'clsx';
import { hex2hsl, hex2rgb, hsl2hex, rgb2hex } from 'colorizr';

import { getColorModes } from '~/modules/helpers';
import { useAppDispatch } from '~/modules/hooks';
import { setOptions } from '~/store/actions';

import { NumericInputOnChangeParameter } from '~/components/NumericInput';

import { ColorState, HSLProperty, ModeType, RGBProperty } from '~/types';

import Slider from './Slider';

import styles from './Sliders.module.css';

interface SlidersProps {
  hex: string;
  model: ColorState['model'];
}

function Sliders({ hex, model }: SlidersProps) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { h, l, s } = hex2hsl(hex);
  const { b, g, r } = hex2rgb(hex);

  const handleChangeInput = (item: NumericInputOnChangeParameter) => {
    const color =
      model === 'hsl'
        ? hsl2hex({ h, s, l, [item.name]: item.value })
        : rgb2hex({ r, g, b, [item.name]: item.value });

    navigate(`/${color}`);
  };

  const handleClickSliderMenu = ({ currentTarget }: MouseEvent<HTMLElement>) => {
    dispatch(setOptions({ model: currentTarget.dataset.model as ColorState['model'] }));
  };

  const handleSliderChange = useCallback(
    (type: HSLProperty | RGBProperty, value: number) => {
      const color = ['h', 'l', 's'].includes(type)
        ? hsl2hex({
            ...hex2hsl(hex),
            [type]: Math.round(value),
          })
        : rgb2hex({
            ...hex2rgb(hex),
            [type]: Math.round(value),
          });

      navigate(`/${color}`, { replace: true });
    },
    [hex, navigate],
  );

  const getSliderData = (mode: ModeType) => {
    const output = {
      ...omit(mode, 'key'),
      type: mode.key,
      value: 0,
    };

    switch (mode.key) {
      case 'h': {
        output.value = Math.round(l === 0 || s === 0 ? 0 : h);
        break;
      }
      case 's': {
        output.value = Math.round(l === 0 ? 0 : s);
        break;
      }
      case 'l': {
        output.value = Math.round(l);
        break;
      }
      case 'r': {
        output.value = r;
        break;
      }
      case 'g': {
        output.value = g;
        break;
      }
      case 'b': {
        output.value = b;
        break;
      }
    }

    return output;
  };

  const types = getColorModes().find(d => d.name === model)?.types ?? [];

  return (
    <div className={styles.main} data-component-name="Sliders">
      <div className={styles.models} data-component-name="SlidersModels">
        <button
          className={clsx(styles.modelBtn, {
            [styles.active]: model === 'hsl',
          })}
          data-model="hsl"
          onClick={handleClickSliderMenu}
          type="button"
        >
          HSL
        </button>
        <button
          className={clsx(styles.modelBtn, {
            [styles.active]: model === 'rgb',
          })}
          data-model="rgb"
          onClick={handleClickSliderMenu}
          type="button"
        >
          RGB
        </button>
      </div>
      <div className={styles.sliders}>
        {types.map(mode => (
          <Slider
            key={mode.key}
            {...getSliderData(mode)}
            onChangeInput={handleChangeInput}
            onSliderChange={handleSliderChange}
          />
        ))}
      </div>
    </div>
  );
}

export default memo(Sliders);
