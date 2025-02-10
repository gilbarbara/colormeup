import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ErrorBoundary } from 'react-error-boundary';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux';
import { ThemeProvider } from '@emotion/react';
import { Loader } from '@gilbarbara/components';
import { PersistGate } from 'redux-persist/lib/integration/react';

import { theme } from '~/modules/theme';
import { persistor, store } from '~/store';

import ErrorHandler from '~/components/ErrorHandler';

import Root from './Root';

window.store = store;

const container = document.getElementById('root');

if (container) {
  const root = createRoot(container);

  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={<Loader block size={100} />} persistor={persistor}>
          <ErrorBoundary FallbackComponent={ErrorHandler}>
            <HelmetProvider>
              <ThemeProvider theme={theme}>
                <Root />
              </ThemeProvider>
            </HelmetProvider>
          </ErrorBoundary>
        </PersistGate>
      </Provider>
    </StrictMode>,
  );
}

/* istanbul ignore next */
