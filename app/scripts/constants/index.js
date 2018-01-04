import keyMirror from 'fbjs/lib/keyMirror';
/**
 * @namespace Constants
 * @desc constants
 */

/**
 * @constant {Object} AppConstants
 * @memberof Constants
 */
export const AppConstants = keyMirror({
  HIDE_ALERT: undefined,
  SHOW_ALERT: undefined,
  TOGGLE_SIDEBAR: undefined,
});

/**
 * @constant {Object} ColorConstants
 * @memberof Constants
 */
export const ColorConstants = keyMirror({
  INITIALIZE: undefined,
  SET_COLOR: undefined,
  SET_OPTIONS: undefined,
});

/**
 * @constant {Object} UserConstants
 * @memberof Constants
 */
export const UserConstants = keyMirror({
  REMOVE_COLOR: undefined,
  RESET_USER_DATA: undefined,
  SAVE_COLOR: undefined,
  SET_USER_OPTIONS: undefined,
});
