import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { original } from 'immer';

import { actionBody, rehydrateAction } from '~/modules/helpers';

import { ColorState } from '~/types';

export const colorState: ColorState = {
  hex: '#ff0044',
  model: 'hsl',
  steps: 16,
  type: 'h',
};

const colorSlice = createSlice({
  name: 'color',
  initialState: colorState,
  extraReducers: builder => {
    builder.addCase(rehydrateAction, (draft, { payload }) => {
      return { ...original(draft), ...payload?.color };
    });
  },
  reducers: {
    setColor: {
      reducer: (draft, { payload }: PayloadAction<string>) => {
        draft.hex = payload;
      },
      prepare: (hex: string) => actionBody(hex),
    },
    setOptions: {
      reducer: (draft, { payload }: PayloadAction<Partial<ColorState>>) => {
        Object.assign(draft, payload);
      },
      prepare: (options: Partial<ColorState>) => actionBody(options),
    },
  },
});

export const { setColor, setOptions } = colorSlice.actions;
export default colorSlice.reducer;
