import { store, persistor } from 'store';

jest.mock('modules/helpers', () => {
  const helpers = require.requireActual('modules/helpers');

  return {
    ...helpers,
    getUnixtime: () => 1234567890,
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
