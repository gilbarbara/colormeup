import { Middleware } from '@reduxjs/toolkit';
import invariant from 'redux-immutable-state-invariant';
import { createLogger } from 'redux-logger';

export default [invariant(), createLogger({ collapsed: true })] as Middleware[];
