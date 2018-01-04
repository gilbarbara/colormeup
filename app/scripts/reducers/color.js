import immutable from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { createReducer } from 'modules/helpers';

import { ColorConstants } from 'constants/index';

export const colorState = {
  hex: '',
  instance: null,
  model: 'hsl',
  steps: 24,
  type: 'h',
};

export default {
  color: createReducer(colorState, {
    [REHYDRATE](state, action) {
      const payload = action.payload || {};

      return {
        ...state,
        ...payload.color,
        instance: null,
      };
    },
    [ColorConstants.INITIALIZE](state, { payload: { instance } }) {
      return immutable(state, {
        hex: { $set: instance.hex },
        instance: { $set: instance },
      });
    },
    [ColorConstants.SET_COLOR](state, { payload: { hex } }) {
      return immutable(state, {
        hex: { $set: hex },
      });
    },
    [ColorConstants.SET_OPTIONS](state, { payload }) {
      return immutable(state, Object.keys(payload).reduce((acc, idx) => {
        acc[idx] = { $set: payload[idx] };
        return acc;
      }, {}));
    },
  }),
};
