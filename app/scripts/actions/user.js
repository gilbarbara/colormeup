/**
 * @module Actions/User
 * @desc User Actions
 */
import { getUnixtime } from 'modules/helpers';
import { UserConstants } from 'constants/index';


export function saveColor(color: string): Object {
  return {
    type: UserConstants.SAVE_COLOR,
    payload: { color },
    meta: { updatedAt: getUnixtime() },
  };
}

export function removeColor(color: string): Object {
  return {
    type: UserConstants.REMOVE_COLOR,
    payload: { color },
    meta: { updatedAt: getUnixtime() },
  };
}

export function setUserOptions(payload: Object): Object {
  return {
    type: UserConstants.SET_USER_OPTIONS,
    payload,
    meta: { updatedAt: getUnixtime() },
  };
}

export function resetUserData(): Object {
  return {
    type: UserConstants.RESET_USER_DATA,
    payload: {},
  };
}
