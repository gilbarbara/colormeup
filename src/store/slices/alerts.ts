import { ReactNode } from 'react';
import { uuid } from '@gilbarbara/helpers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import is from 'is-lite';

import { actionBody } from '~/modules/helpers';

import { AlertData, AlertsState, ShowAlertOptions } from '~/types';

export const alertsState: AlertsState = {
  data: [],
};

const alertsSlice = createSlice({
  name: 'alerts',
  initialState: alertsState,
  reducers: {
    alertHide: (draft, { payload }: PayloadAction<string>) => {
      draft.data = draft.data.filter(d => d.id !== payload);
    },
    alertShow: {
      reducer: (draft, { payload }: PayloadAction<AlertData>) => {
        draft.data.push(payload);
      },
      prepare: (content: ReactNode, options: ShowAlertOptions) => {
        const {
          icon,
          id = uuid(),
          position = 'top-right',
          skipWrapper,
          timeout,
          type = 'success',
        } = options;
        const defaultTimeout = type === 'error' ? 0 : 5;

        return actionBody({
          id,
          icon,
          content,
          position,
          skipWrapper,
          type,
          timeout: is.number(timeout) ? timeout : defaultTimeout,
        });
      },
    },
  },
});

export const { alertHide, alertShow } = alertsSlice.actions;
export default alertsSlice.reducer;
