import { now } from '@gilbarbara/helpers';
import { createAction } from '@reduxjs/toolkit';
import { REHYDRATE } from 'redux-persist';

import { modes } from '~/config';

import { ModeType, RootState } from '~/types';

export function actionBody<T = any>(payload: T) {
  return { payload };
}

export function getColorModes() {
  return Object.entries(modes).reduce<Array<{ name: string; types: ModeType[] }>>(
    (acc, [name, mode]) => {
      const keys = Object.keys(mode);

      acc.push({
        name,
        types: keys.map(d => ({
          ...mode[d],
          key: d,
          slug: mode[d].name.toLowerCase(),
        })),
      });

      return acc;
    },
    [],
  );
}

/**
 * Check if cache is valid
 */
export function hasValidCache(lastUpdated: number, max = 10): boolean {
  if (!navigator.onLine) {
    return true;
  }

  return lastUpdated + max * 60 > now();
}

/**
 * Test if the input is a valid number
 */
export function isNumber(input: unknown): input is number {
  return typeof input === 'number' && !Number.isNaN(input);
}

export function parseColorInput(input: string) {
  return `#${input.replace(/^#/, '')}`;
}

export const rehydrateAction = createAction<RootState>(REHYDRATE);
