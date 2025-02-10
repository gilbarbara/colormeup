import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import is from 'is-lite';

import { AppState } from '~/types';

export const appState: AppState = {
  isSidebarOpen: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState: appState,
  reducers: {
    toggleSidebar: (draft, { payload }: PayloadAction<boolean | undefined>) => {
      draft.isSidebarOpen = is.boolean(payload) ? payload : !draft.isSidebarOpen;
    },
  },
});

export const { toggleSidebar } = appSlice.actions;
export default appSlice.reducer;
