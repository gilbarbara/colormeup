import { persistor, store } from '~/store';

vi.mock('@gilbarbara/helpers', () => {
  const helpers = vi.importActual('@gilbarbara/helpers');

  return {
    ...helpers,
    now: () => 1234567890,
  };
});

describe('store', () => {
  it('should have a store', () => {
    expect(store.getState()).toMatchSnapshot();
  });

  it('should have a persistor', () => {
    expect(persistor.getState()).toEqual({
      bootstrapped: true,
      registry: [],
    });
  });
});
