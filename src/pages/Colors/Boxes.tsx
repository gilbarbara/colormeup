import { JSX, memo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Colors,
  hex2hsl,
  hex2rgb,
  HSL,
  hsl2hex,
  hsl2rgb,
  RGB,
  rgb2hex,
  rgb2hsl,
  textColor,
} from 'colorizr';

import styles from './Colors.module.css';

interface Props {
  hex: string;
  steps: number;
  type: string;
}

function Boxes({ hex, steps, type }: Props) {
  const handleClick = () => {
    if (document.body.scrollTop > 150) {
      // TODO: scroll to top
    }
  };

  const changeHSLValue = useCallback(
    (model: keyof HSL, value: number) => {
      const hsl = {
        ...hex2hsl(hex),
        [model]: value,
      };

      return {
        hsl,
        rgb: hsl2rgb(hsl),
        hex: hsl2hex(hsl),
      } as Colors;
    },
    [hex],
  );

  const changeRGBValue = useCallback(
    (model: keyof RGB, value: number) => {
      const rgb = {
        ...hex2rgb(hex),
        [model]: value,
      };

      return {
        rgb,
        hsl: rgb2hsl(rgb),
        hex: rgb2hex(rgb),
      } as Colors;
    },
    [hex],
  );

  const renderBox = useCallback(
    ({ hex: color }: Colors) => {
      return (
        <Link
          key={`${color}-${Math.random()}`}
          className={styles.colorLink}
          onClick={handleClick}
          style={{ backgroundColor: color }}
          to={`/${color}`}
        >
          <div
            className={styles.colorBox}
            data-component-name="ColorBox"
            style={{ color: textColor(color), fontWeight: hex === color ? 'bold' : 'normal' }}
          >
            {color}
          </div>
        </Link>
      );
    },
    [hex],
  );

  const HSLBoxes = useCallback(() => {
    const settings = {
      max: type === 'h' ? 360 : 100,
    };
    const rate = settings.max / steps;
    const boxes = [];

    let value = hex2hsl(hex)[type as keyof HSL] || 0;

    if (type !== 'h') {
      while (value < settings.max) {
        value += rate;
      }

      value -= rate;
    }

    for (let index = 0; index < steps; index++) {
      boxes.push(renderBox(changeHSLValue(type as keyof HSL, value < 0 ? 0 : value)));

      if (type === 'h') {
        value += rate;

        if (value > settings.max) {
          value += -settings.max;
        }
      } else {
        value -= rate;
      }
    }

    return boxes;
  }, [changeHSLValue, hex, renderBox, steps, type]);

  const RGBBoxes = useCallback(() => {
    const settings = {
      max: 255,
    };
    const rate = settings.max / steps;
    const boxes = [];
    let value = hex2rgb(hex)[type as keyof RGB] || 0;

    while (value < settings.max) {
      value += rate;
    }

    value -= rate;

    for (let index = 0; index < steps; index++) {
      boxes.push(renderBox(changeRGBValue(type as keyof RGB, Math.round(value))));
      value -= rate;
    }

    return boxes;
  }, [changeRGBValue, hex, renderBox, steps, type]);

  let output: JSX.Element[] = [];

  if ('rgb'.includes(type)) {
    output = RGBBoxes();
  } else if ('hsl'.includes(type)) {
    output = HSLBoxes();
  }

  return (
    <div className={styles.boxes} data-component-name="ColorBoxes">
      {output}
    </div>
  );
}

export default memo(Boxes);
