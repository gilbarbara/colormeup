import { memo, useLayoutEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { isHex } from 'colorizr';

import { colors } from '~/config';
import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { setColor } from '~/store/actions';
import { selectColor } from '~/store/selectors';

import Boxes from './Boxes';

import styles from './Colors.module.css';

function Colors() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { hex, steps, type } = useAppSelector(selectColor);
  const { hash } = useLocation();

  useLayoutEffect(() => {
    const defaultColor = colors[Math.floor(Math.random() * (colors.length - 1)) + 1];
    const isValidHash = isHex(hash);
    const color = isValidHash ? hash : defaultColor;

    if (!isValidHash) {
      navigate(`/${color}`);
    } else if (color !== hex) {
      dispatch(setColor(color));
    }

    document.title = `${color ? `${color} @ ` : ''}colormeup`;
  }, [dispatch, hash, hex, navigate]);

  return (
    <div className={styles.main} data-component-name="Color">
      {hex && <Boxes hex={hex} steps={steps} type={type} />}
    </div>
  );
}

export default memo(Colors);
