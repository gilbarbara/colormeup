import immutable from 'immutability-helper';
import { REHYDRATE } from 'redux-persist/lib/constants';
import { createReducer } from 'modules/helpers';

import { AppConstants } from 'constants/index';

export const appState = {
  alerts: [],
  isSidebarActive: false,
  version: 3.0,
};

export default {
  app: createReducer(appState, {
    [REHYDRATE](state) {
      return immutable(state, {
        alerts: { $set: [] },
      });
    },
    [AppConstants.TOGGLE_SIDEBAR](state, { payload: { active } }) {
      return immutable(state, {
        isSidebarActive: { $set: active },
      });
    },
    [AppConstants.HIDE_ALERT](state, { payload: { id } }) {
      const alerts = state.alerts.filter(d => d.id !== id);

      return immutable(state, {
        alerts: { $set: alerts },
      });
    },
    [AppConstants.SHOW_ALERT](state, { payload }) {
      return immutable(state, {
        alerts: { $push: [payload] },
      });
    },
  }),
};
