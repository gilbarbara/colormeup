import { configureStore, Tuple } from '@reduxjs/toolkit';
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistCombineReducers,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2';
import storage from 'redux-persist/lib/storage';

import { RootState } from '~/types';

import dynamicMiddlewares from './dynamic-middlewares';
import middlewares from './middlewares';
import alerts, { alertsState } from './slices/alerts';
import app, { appState } from './slices/app';
import color, { colorState } from './slices/color';
import user, { userState } from './slices/user';

const getDefaultMiddlewareOptions = {
  serializableCheck: {
    ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
  },
  thunk: false,
};

export const initialState = {
  alerts: alertsState,
  app: appState,
  color: colorState,
  user: userState,
};

export const reducers = {
  alerts,
  app,
  color,
  user,
};

const rootReducer = persistCombineReducers<RootState>(
  {
    key: 'colormeup',
    stateReconciler: autoMergeLevel2,
    storage,
    blacklist: ['alerts'],
    timeout: 0,
    version: 1,
  },
  reducers,
);

/* istanbul ignore next */
export const configStore = (preloadedState: any = {}) => {
  const storeEnhanced = configureStore({
    reducer: rootReducer,
    middleware: getDefaultMiddleware => {
      return new Tuple(
        ...getDefaultMiddleware(getDefaultMiddlewareOptions),
        ...middlewares,
        dynamicMiddlewares,
      );
    },
    preloadedState,
  });

  return {
    persistor: persistStore(storeEnhanced),
    store: storeEnhanced,
  };
};

export const { persistor, store } = configStore();
