/**
 * @module Actions/Color
 * @desc Color Actions
 */
import { ColorConstants } from 'constants/index';


export function initialize(instance: Object): Object {
  return {
    type: ColorConstants.INITIALIZE,
    payload: { instance },
  };
}

export function setColor(hex: string): Object {
  return {
    type: ColorConstants.SET_COLOR,
    payload: { hex },
  };
}

export function setOptions(payload: Object): Object {
  return {
    type: ColorConstants.SET_OPTIONS,
    payload,
  };
}
