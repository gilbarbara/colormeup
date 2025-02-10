import { Types } from '@gilbarbara/components';
import is from 'is-lite';

import { breakpoints } from '~/config';

/**
 * Get screen size breakpoint
 */
export function getBreakpoint(): Types.Breakpoint {
  const windowWidth = window.innerWidth;
  let breakpoint = 'xxs';

  /* istanbul ignore next */
  if (windowWidth >= 1920) {
    breakpoint = 'xxxl';
  } else if (windowWidth >= 1440) {
    breakpoint = 'xxl';
  } else if (windowWidth >= 1280) {
    breakpoint = 'xl';
  } else if (windowWidth >= 1024) {
    breakpoint = 'lg';
  } else if (windowWidth >= 768) {
    breakpoint = 'md';
  } else if (windowWidth >= 400) {
    breakpoint = 'sm';
  } else if (windowWidth >= 375) {
    breakpoint = 'xs';
  }

  return breakpoint as Types.Breakpoint;
}

/**
 * Return true for any screen size below a given breakpoint
 */
export function maxScreenSize(breakpoint: Types.Breakpoint | number = 'md') {
  return !minScreenSize(breakpoint);
}

/**
 * Return true for any screen size above a given breakpoint
 */
export function minScreenSize(breakpoint: Types.Breakpoint | number = 'md') {
  const width = window.innerWidth;

  if (is.number(breakpoint)) {
    return width >= breakpoint;
  }

  return width >= breakpoints[breakpoint];
}
