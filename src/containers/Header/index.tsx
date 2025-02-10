import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { Flex } from '@gilbarbara/components';
import Colorizr from 'colorizr';

import { useAppSelector } from '~/modules/hooks';
import { selectColor } from '~/store/selectors';

import Logo from '~/components/Logo';

import Options from './Options';
import Selectors from './Selectors';
import Sliders from './Sliders';
import Toggle from './Toggle';

import styles from './Header.module.css';

export default function Header() {
  const { hex, model, type } = useAppSelector(selectColor);
  const location = useLocation();

  useEffect(() => {
    const root = document.querySelector(':root') as HTMLElement;

    root.style.setProperty('--selected-color', location.hash);
  }, [location]);

  const handleKeyPress = useRef((event: KeyboardEvent) => {
    const target = event.target as HTMLInputElement;

    if (target.tagName === 'BODY' && event.code === 'Space') {
      event.preventDefault();
      (document.querySelector('.random-color') as HTMLButtonElement)?.click();
    }
  });

  useEffect(() => {
    const { current } = handleKeyPress;

    document.addEventListener('keypress', current);

    return () => {
      document.body.removeEventListener('keypress', current);
    };
  }, []);

  if (!hex) {
    return null;
  }

  const instance = new Colorizr(hex);

  return (
    <div
      className={styles.main}
      data-component-name="Header"
      style={{ backgroundColor: hex, borderColor: instance.darken(15) }}
    >
      <div className={styles.content}>
        <Logo instance={instance} />
        <Flex direction="column" gap="md">
          <Options hex={hex} />
          <Sliders hex={hex} model={model} />
          <Selectors type={type} />
        </Flex>
        <Toggle instance={instance} />
      </div>
    </div>
  );
}
