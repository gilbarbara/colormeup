import { render, screen } from '@testing-library/react';

import NotFound from '~/pages/NotFound';

describe('NotFound', () => {
  render(<NotFound />);

  it('should render properly', () => {
    expect(screen.getByTestId('NotFound')).toMatchSnapshot();
  });
});
