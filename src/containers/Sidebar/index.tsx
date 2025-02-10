import { memo, useMemo } from 'react';
import { Flex } from '@gilbarbara/components';
import clsx from 'clsx';
import Colorizr, { hsl2hex } from 'colorizr';

import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { toggleSidebar } from '~/store/actions';
import { selectApp, selectColor } from '~/store/selectors';

import Favorites from './Favorites';
import Help from './Help';
import Info from './Info';

import styles from './Sidebar.module.css';

function Sidebar() {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector(selectApp);
  const { hex } = useAppSelector(selectColor);

  const handleClickColor = () => {
    dispatch(toggleSidebar(false));
  };

  const instance = useMemo(() => new Colorizr(hex), [hex]);

  const data = useMemo(() => {
    const currentColor = hsl2hex({
      h: (instance.hue + 90) % 360,
      s: instance.saturation < 30 ? Math.abs(instance.saturation + 30) : instance.saturation,
      l: instance.lightness < 35 ? instance.lightness + 20 : instance.lightness,
    });
    const backupColor = instance.lightness < 30 ? '#FFF' : '#333';

    return {
      chroma: instance.chroma,
      luminance: instance.luminance,
      textColor: instance.textColor,
      hex: instance.hex,
      hsl: `hsl(${Math.round(instance.hue)}, ${Math.round(instance.saturation)}%, ${Math.round(
        instance.lightness,
      )}%)`,
      rgb: `rgb(${instance.red}, ${instance.green}, ${instance.blue})`,
      currentColor: instance.saturation > 8 ? currentColor : backupColor,
    };
  }, [instance]);

  return (
    <Flex
      className={clsx(styles.main, {
        [styles.mainOpen]: isSidebarOpen,
      })}
      data-component-name="Sidebar"
      direction="column"
      gap="xl"
    >
      <Info data={data} />
      <Favorites onClickColor={handleClickColor} />
      <Help color={instance.lightness < 20 ? '#fff' : hex} />
    </Flex>
  );
}

export default memo(Sidebar);
