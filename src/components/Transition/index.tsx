import { Children, CSSProperties, ReactNode } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { mergeProps } from '@gilbarbara/helpers';

import { Transitions } from '~/types';

import transitions, { classNames } from './transitions';

interface TransitionProps {
  appear?: boolean;
  children: ReactNode;
  className?: string;
  enter?: boolean;
  exit?: boolean;
  style?: CSSProperties;
  timeout?: number;
  transition?: Transitions;
}

const defaultProps = {
  appear: true,
  enter: true,
  exit: true,
  timeout: 300,
  transition: 'fade',
} satisfies Partial<TransitionProps>;

function Transition(props: TransitionProps) {
  const { children, className, style, transition, ...rest } = mergeProps(defaultProps, props);
  const Component = transitions[transition];

  if (!Component) {
    console.error(`Invalid transition: ${transition}`); // eslint-disable-line no-console

    return null;
  }

  return (
    <TransitionGroup className={className} style={style}>
      {Children.toArray(children)
        .filter(child => !!child)
        .map((child, index) => {
          const key = `Transition-${index}`;

          return (
            <CSSTransition key={key} classNames={classNames[transition]} {...rest}>
              <Component>{child}</Component>
            </CSSTransition>
          );
        })}
    </TransitionGroup>
  );
}

export default Transition;
