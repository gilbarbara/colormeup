import immutable from 'immutability-helper';
import { createReducer, getUnixtime } from 'modules/helpers';

import { UserConstants } from 'constants/index';

export const userState = {
  colors: [],
  createdAt: getUnixtime(),
  showHelp: true,
  showStarterKit: true,
  updatedAt: getUnixtime(),
};

export default {
  user: createReducer(userState, {
    [UserConstants.SAVE_COLOR](state, { payload: { color }, meta: { updatedAt } }) {
      return immutable(state, {
        colors: { $push: [color] },
        updatedAt: { $set: updatedAt },
      });
    },
    [UserConstants.REMOVE_COLOR](state, { payload: { color }, meta: { updatedAt } }) {
      return immutable(state, {
        colors: { $apply: colors => colors.filter(d => d !== color) },
        updatedAt: { $set: updatedAt },
      });
    },
    [UserConstants.SET_USER_OPTIONS](state, { payload, meta: { updatedAt } }) {
      return immutable(state, {
        ...Object.keys(payload).reduce((acc, idx) => {
          acc[idx] = { $set: payload[idx] };
          return acc;
        }, {}),
        updatedAt: { $set: updatedAt },
      });
    },
    [UserConstants.RESET_USER_DATA]() {
      return { ...userState };
    },
  }),
};
