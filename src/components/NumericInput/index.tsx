import {
  ChangeEvent,
  KeyboardEvent,
  MouseEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useUnmount } from 'react-use';
import { Icon } from '@gilbarbara/components';
import { StringOrNumber } from '@gilbarbara/types';
import is from 'is-lite';

import styles from './NumericInput.module.css';

const SPEED = 50;
const DELAY = 500;

interface NumericInputProps {
  max?: number;
  min?: number;
  name: string;
  onChange?: (item: NumericInputOnChangeParameter) => void;
  precision?: number;
  step?: number;
  value: number;
}

export type NumericInputOnChangeParameter = { name: string; value: number };

export default function NumericInput(props: NumericInputProps) {
  const {
    max = Number.MAX_SAFE_INTEGER || 9007199254740991,
    min = Number.MIN_SAFE_INTEGER || -9007199254740991,
    name,
    onChange,
    precision = 0,
    step = 1,
    value,
  } = props;

  const inputRef = useRef<HTMLInputElement>(null);
  const timeout = useRef<number | null>(null);

  const parseValue = useCallback(
    (input: StringOrNumber): number => {
      let n = is.number(input) ? input : parseFloat(input);

      if (Number.isNaN(n) || !Number.isFinite(n)) {
        n = 0;
      }

      n = Math.min(Math.max(n, min), max);

      return parseFloat(n.toFixed(precision));
    },
    [max, min, precision],
  );

  const [innerValue, setInnerValue] = useState(parseValue(value));

  const stopTimer = () => {
    if (timeout.current) {
      window.clearTimeout(timeout.current);
      timeout.current = null;
    }
  };

  useEffect(() => {
    setInnerValue(parseValue(value));
  }, [parseValue, value]);

  useUnmount(() => {
    stopTimer();
  });

  const updateStep = (input: number) => {
    const nextValue = parseValue(innerValue + step * input);

    if (nextValue !== innerValue) {
      setInnerValue(nextValue);
      onChange?.({ name, value: nextValue });
    }
  };

  const handleChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const nextValue = parseValue(target.value);

    setInnerValue(nextValue);
    onChange?.({ name, value: nextValue });
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (['ArrowDown', 'ArrowUp'].includes(event.code)) {
      event.preventDefault();

      const amount = event.code === 'ArrowUp' ? 1 : -1;
      let nextStep = 1;

      if ((event.ctrlKey || event.metaKey) && step < 1) {
        nextStep = 0.1;
      } else if (event.shiftKey) {
        nextStep = 10;
      }

      if ((innerValue > min || innerValue < max) && timeout.current === null) {
        timeout.current = window.setTimeout(() => {
          updateStep(nextStep * amount);
          stopTimer();
        }, SPEED);
      }
    }
  };

  const handleClickButton = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    if (currentTarget.dataset.direction === 'up') {
      increase();
    } else {
      decrease();
    }
  };

  const handleMouseExit = () => {
    stopTimer();
  };

  /**
   * Increments the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "up" button
   * and will be stopped on mouseout/mouseup.
   */
  const increase = (recursive = false, doFocus = true) => {
    stopTimer();
    updateStep(1);

    if (Number.isNaN(innerValue) || innerValue < max) {
      timeout.current = window.setTimeout(
        () => {
          increase(true);
        },
        recursive ? SPEED : DELAY,
      );
    }

    if (doFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  };

  /**
   * Decrements the value with one step and the enters a recursive calls
   * after DELAY. This is bound to the mousedown event on the "down" button
   * and will be stopped on mouseout/mouseup.
   */
  const decrease = (recursive = false, doFocus = true) => {
    stopTimer();
    updateStep(-1);

    if (Number.isNaN(innerValue) || innerValue > min) {
      timeout.current = window.setTimeout(
        () => {
          decrease(true);
        },
        recursive ? SPEED : DELAY,
      );
    }

    if (doFocus) {
      setTimeout(() => {
        inputRef.current?.focus();
      });
    }
  };

  const inputProps = {
    name,
    onChange: handleChange,
    onKeyDown: handleKeyDown,
    onKeyUp: stopTimer,
    type: 'text',
    value,
  };

  return (
    <div
      className={styles.main}
      onBlur={handleMouseExit}
      onMouseOut={handleMouseExit}
      onMouseUp={handleMouseExit}
      role="presentation"
    >
      <input ref={inputRef} className={styles.input} {...inputProps} />
      <div className={styles.buttons}>
        <button
          className={styles.button}
          data-direction="up"
          onMouseDown={handleClickButton}
          onMouseUp={handleMouseExit}
          type="button"
        >
          <Icon name="chevron-up" size={12} />
        </button>
        <button
          className={styles.button}
          data-direction="down"
          onMouseDown={handleClickButton}
          onMouseUp={handleMouseExit}
          type="button"
        >
          <Icon name="chevron-down" size={12} />
        </button>
      </div>
    </div>
  );
}
