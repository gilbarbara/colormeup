import { memo } from 'react';
import Colorizr, { hsl2hex } from 'colorizr';

import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { toggleSidebar } from '~/store/actions';
import { selectApp } from '~/store/selectors';

import styles from './Header.module.css';

interface HeaderToggleProps {
  instance: Colorizr;
}

function HeaderToggle({ instance }: HeaderToggleProps) {
  const dispatch = useAppDispatch();
  const { isSidebarOpen } = useAppSelector(selectApp);

  const handleClickToggle = () => {
    dispatch(toggleSidebar(!isSidebarOpen));
  };

  const backupColor = instance.lightness < 30 ? '#FFF' : '#333';

  return (
    <div className={styles.toggle} data-component-name="HeaderToggle">
      <label aria-label="Toggle Menu" htmlFor="sidebar-toggle">
        <input
          checked={isSidebarOpen}
          id="sidebar-toggle"
          onChange={handleClickToggle}
          type="checkbox"
        />
        <span
          style={{
            color:
              instance.saturation > 8
                ? hsl2hex({
                    h: (instance.hue + 90) % 360,
                    s:
                      instance.saturation < 30
                        ? Math.abs(instance.saturation + 30)
                        : instance.saturation,
                    l: instance.lightness < 35 ? instance.lightness + 20 : instance.lightness,
                  })
                : backupColor,
          }}
        />
      </label>
    </div>
  );
}

export default memo(HeaderToggle);
