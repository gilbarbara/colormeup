// @flow
/**
 * Helper functions
 * @module Helpers
 */
import config from 'config';

/**
 * Generate reducer.
 *
 * @param {Object} initialState
 * @param {Object} handlers
 * @returns {function}
 */
export function createReducer(initialState: Object, handlers: Object): Function {
  return function reducer(state: Object = initialState, action: Object): Object {
    if ({}.hasOwnProperty.call(handlers, action.type)) {
      return handlers[action.type](state, action);
    }

    return state;
  };
}

export function getColorModes(): Array<Object> {
  return Object.keys(config.modes).reduce((acc, idx) => {
    const mode = config.modes[idx];
    acc.push({
      name: idx,
      types: Object.keys(mode).map(d => ({ ...mode[d], key: d, slug: mode[d].name.toLowerCase() })),
    });

    return acc;
  }, []);
}

/**
 * Get Unix timestamp in seconds.
 *
 * @returns {number}
 */
export function getUnixtime(): number {
  return Math.floor(Date.now() / 1000);
}

/**
 * Test a value to be a valid number
 *
 * @param {string|number} value
 * @returns {boolean}
 */
export function isNumber(value: string | number): boolean {
  return !isNaN(parseInt(value, 10));
}
