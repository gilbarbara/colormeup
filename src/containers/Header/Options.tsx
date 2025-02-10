import { ChangeEvent, memo, MouseEvent, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSetState } from 'react-use';
import { animateIcon, ButtonUnstyled, CopyToClipboard, Icon, theme } from '@gilbarbara/components';
import { isHex, random } from 'colorizr';

import { parseColorInput } from '~/modules/helpers';
import { useAppDispatch } from '~/modules/hooks';
import { saveColor } from '~/store/actions';

import { ColorState } from '~/types';

import styles from './Header.module.css';

function HeaderOptions({ hex }: Pick<ColorState, 'hex'>) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [{ rotate, value }, setState] = useSetState({
    rotate: false,
    value: hex,
  });

  useEffect(() => {
    const isFocused = inputRef.current === document.activeElement;

    if (!isFocused && hex !== value) {
      setState({ value: hex });
    }
  }, [hex, setState, value]);

  const handleChangeInput = ({ target }: ChangeEvent<HTMLInputElement>) => {
    const input = parseColorInput(target.value.replace(/[^\d#a-f]/gi, ''));

    if (input.length > 7) {
      return;
    }

    setState({ value: input });

    const color = `#${input.replace(/[^\da-f]+/i, '').slice(-6)}`;

    if (isHex(color)) {
      navigate(`/${color}`);
    }
  };

  const handleClickRandomColor = () => {
    const randomColor = random();

    setState({ rotate: true });
    setTimeout(() => {
      setState({ rotate: false });
    }, 400);

    navigate(randomColor);
  };

  const handleClickSaveColor = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    animateIcon(currentTarget, 'primary', theme);

    dispatch(saveColor(hex));
  };

  return (
    <div className={styles.options} data-component-name="HeaderOptions">
      <div className={styles.optionsGroup} data-component-name="HeaderOptionsGroup">
        <span>
          <ButtonUnstyled onClick={handleClickRandomColor} title="Randomize Color">
            <Icon name="sync" size={20} spin={rotate} />
          </ButtonUnstyled>
        </span>
        <input
          ref={inputRef}
          name="color"
          onChange={handleChangeInput}
          tabIndex={0}
          type="text"
          value={value}
        />
        <span>
          <CopyToClipboard size={20} value={hex} />
        </span>
        <span>
          <ButtonUnstyled onClick={handleClickSaveColor} title="Add to Favorites">
            <Icon name="heart" size={20} />
          </ButtonUnstyled>
        </span>
      </div>
    </div>
  );
}

export default memo(HeaderOptions);
