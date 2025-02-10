import React, { ComponentProps } from 'react';
import { Alert, Types } from '@gilbarbara/components';

export type ColorModes = 'hsl' | 'rgb';

export type HSLProperty = 'h' | 's' | 'l';
export type RGBProperty = 'r' | 'g' | 'b';

export type ShowAlertOptions = Partial<AlertData>;
export type Transitions = 'fade' | 'slideDown' | 'slideLeft' | 'slideRight' | 'slideUp';

export interface AlertData {
  content: React.ReactNode;
  icon?: Types.Icons;
  id: string;
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  skipWrapper?: boolean;
  timeout: number;
  type: ComponentProps<typeof Alert>['type'];
}

export interface Modes {
  hsl: {
    [key in HSLProperty]: {
      max: number;
      name: string;
    };
  };
  rgb: {
    [key in RGBProperty]: {
      max: number;
      name: string;
    };
  };
}

export interface ModeType {
  key: HSLProperty | RGBProperty;
  max: number;
  name: string;
  slug: string;
}

export interface UIOptions {
  isSidebarOpen: boolean;
}
