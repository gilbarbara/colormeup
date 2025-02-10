import { now } from '@gilbarbara/helpers';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { actionBody } from '~/modules/helpers';

import { UserState } from '~/types';

export const userState: UserState = {
  colors: [],
  createdAt: now(),
  showHelp: true,
  showStarterKit: true,
  updatedAt: now(),
};

const userSlice = createSlice({
  name: 'user',
  initialState: userState,
  reducers: {
    saveColor: {
      reducer: (draft, { payload }: PayloadAction<{ color: string; updatedAt: number }>) => {
        draft.colors.push(payload.color);
        draft.updatedAt = payload.updatedAt;
      },
      prepare: (color: string, updatedAt: number = now()) => actionBody({ color, updatedAt }),
    },
    removeColor: {
      reducer: (draft, { payload }: PayloadAction<{ color: string; updatedAt: number }>) => {
        draft.colors = draft.colors.filter(c => c !== payload.color);
        draft.updatedAt = payload.updatedAt;
      },
      prepare: (color: string, updatedAt: number = now()) => actionBody({ color, updatedAt }),
    },
    resetUserData: () => userState,
    setUserOptions: {
      reducer: (draft, { payload }: PayloadAction<Partial<UserState>>) => {
        Object.assign(draft, payload);
      },
      prepare: (options: Partial<UserState>, updatedAt: number = now()) =>
        actionBody({ ...options, updatedAt }),
    },
  },
});

export const { removeColor, resetUserData, saveColor, setUserOptions } = userSlice.actions;
export default userSlice.reducer;
