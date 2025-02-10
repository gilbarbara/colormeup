import { Middleware } from 'redux';

const middlewares: Middleware[] = [];

if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const devMiddlewares = require('./middlewares-dev').default;

  middlewares.push(...devMiddlewares);
}

export default middlewares;
