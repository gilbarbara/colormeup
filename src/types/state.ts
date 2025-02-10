import { HSL, RGB } from 'colorizr';

import { AlertData } from './common';

export interface AlertsState {
  data: AlertData[];
}

export interface AppState {
  isSidebarOpen: boolean;
}

export interface ColorState {
  hex: string;
  model: 'hsl' | 'rgb';
  steps: number;
  type: keyof HSL | keyof RGB;
}

export interface RootState {
  alerts: AlertsState;
  app: AppState;
  color: ColorState;
  user: UserState;
}

export interface UserState {
  colors: string[];
  createdAt: number;
  showHelp: boolean;
  updatedAt: number;
}
