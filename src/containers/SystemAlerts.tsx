import { cloneElement, isValidElement, MouseEvent, useCallback, useEffect, useRef } from 'react';
import { useUnmount } from 'react-use';
import styled from '@emotion/styled';
import {
  Alert,
  ButtonUnstyled,
  FormElementWrapper,
  Icon,
  responsive,
  theme,
} from '@gilbarbara/components';

import { useAppDispatch, useAppSelector } from '~/modules/hooks';
import { alertHide } from '~/store/actions';

import Transition from '~/components/Transition';

const Base = styled.div`
  position: fixed;
  z-index: 1000;

  > div {
    > * + * {
      margin-top: ${theme.spacing.lg};
    }
  }
`;

const TopLeft = styled(Base)`
  left: ${theme.spacing.lg};
  top: ${theme.spacing.lg};
  width: 260px;

  ${
    /* sc-custom '@media-query' */ responsive({
      md: {
        width: '320px',
      },
    })
  };
`;

const TopRight = styled(Base)`
  right: ${theme.spacing.lg};
  top: ${theme.spacing.lg};
  width: 260px;

  ${
    /* sc-custom '@media-query' */
    responsive({
      md: {
        width: '320px',
      },
    })
  };
`;

const BottomLeft = styled(Base)`
  bottom: ${theme.spacing.lg};
  left: ${theme.spacing.lg};
  width: 260px;

  ${
    /* sc-custom '@media-query' */
    responsive({
      md: {
        width: '320px',
      },
    })
  };
`;

const BottomRight = styled(Base)`
  bottom: ${theme.spacing.lg};
  right: ${theme.spacing.lg};
  width: 260px;

  ${
    /* sc-custom '@media-query' */
    responsive({
      md: {
        width: '320px',
      },
    })
  };
`;

const SystemAlertsWrapper = styled.div`
  pointer-events: none;
  position: fixed;
  z-index: 1000;

  [data-component-name='Alert'] {
    cursor: pointer;
    pointer-events: all;
  }
`;

export default function SystemAlerts() {
  const dispatch = useAppDispatch();
  const alerts = useAppSelector(s => s.alerts.data);
  const timeouts: Record<string, any> = useRef({});

  useEffect(() => {
    const { current } = timeouts;

    if (alerts.length) {
      alerts.forEach(d => {
        if (d.timeout && !current[d.id]) {
          current[d.id] = setTimeout(() => {
            dispatch(alertHide(d.id));
          }, d.timeout * 1000);
        }
      });
    }
  }, [alerts, dispatch]);

  useUnmount(() => {
    const { current } = timeouts;

    Object.keys(current).forEach(d => {
      clearTimeout(current[d]);
    });
  });

  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();
      const { id = '' } = event.currentTarget.dataset;

      dispatch(alertHide(id));
    },
    [dispatch],
  );

  const renderAlerts = useCallback(
    (position: string) => {
      const items = alerts.filter(d => d.position === position);

      if (!items.length) {
        return null;
      }

      return items.map(alert => {
        const { content, icon, id, skipWrapper, type } = alert;

        if (skipWrapper && isValidElement(content)) {
          return cloneElement(content, { key: id });
        }

        return (
          <FormElementWrapper
            key={id}
            endContent={
              <ButtonUnstyled data-id={id} onClick={handleClick}>
                <Icon name="close" />
              </ButtonUnstyled>
            }
          >
            <Alert icon={icon} type={type}>
              {content}
            </Alert>
          </FormElementWrapper>
        );
      });
    },
    [alerts, handleClick],
  );

  return (
    <SystemAlertsWrapper data-component-name="SystemAlerts">
      <TopLeft>
        <Transition transition="slideRight">{renderAlerts('top-left')}</Transition>
      </TopLeft>
      <TopRight>
        <Transition transition="slideLeft">{renderAlerts('top-right')}</Transition>
      </TopRight>
      <BottomLeft>
        <Transition transition="slideRight">{renderAlerts('bottom-left')}</Transition>
      </BottomLeft>
      <BottomRight>
        <Transition transition="slideLeft">{renderAlerts('bottom-right')}</Transition>
      </BottomRight>
    </SystemAlertsWrapper>
  );
}
