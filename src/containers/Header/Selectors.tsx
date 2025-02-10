import { memo, MouseEvent } from 'react';
import styled from '@emotion/styled';
import { Button, ButtonGroup, Spacer } from '@gilbarbara/components';

import { getColorModes } from '~/modules/helpers';
import { useAppDispatch } from '~/modules/hooks';
import { setOptions } from '~/store/actions';

import { ColorState } from '~/types';

import Steps from './Steps';

import styles from './Header.module.css';

const Wrapper = styled(Spacer)`
  [data-component-name='Button'] {
    font-weight: normal;

    &[data-filled='false'] {
      background-color: #fff;
    }
  }
`;

function HeaderSelectors({ type }: Pick<ColorState, 'type'>) {
  const dispatch = useAppDispatch();

  const handleClickTypesMenu = ({ currentTarget }: MouseEvent<HTMLButtonElement>) => {
    dispatch(setOptions({ type: currentTarget.dataset.type as 'h' | 's' | 'l' }));
  };

  return (
    <Wrapper
      className={styles.selectors}
      data-component-name="HeaderSelectors"
      distribution="space-between"
    >
      {getColorModes().map(d => (
        <ButtonGroup key={d.name} aria-label={d.name} bg="black" size="sm">
          {d.types.map(m => (
            <Button
              key={m.key}
              data-filled={type === m.key ? 'true' : 'false'}
              data-type={m.key}
              onClick={handleClickTypesMenu}
              variant={type !== m.key ? 'bordered' : 'solid'}
            >
              {m.name}
            </Button>
          ))}
        </ButtonGroup>
      ))}

      <Steps />
    </Wrapper>
  );
}

export default memo(HeaderSelectors);
