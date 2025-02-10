import React from 'react';
import { Provider } from 'react-redux';
import { render, screen } from '@testing-library/react';

import Root from '~/Root';
import { store } from '~/store';

vi.mock('react-helmet-async', () => ({
  Helmet: ({ children }) => <div>{children}</div>,
  HelmetProvider: () => vi.fn(),
}));

describe('Root', () => {
  render(<Root />, { wrapper: ({ children }) => <Provider store={store}>{children}</Provider> });

  it('should render properly', () => {
    expect(screen.getByTestId('Root')).toMatchSnapshot();
  });
});
