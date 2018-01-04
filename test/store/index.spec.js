import { store, persistor } from 'app-store';

jest.mock('modules/helpers', () => {
  const helpers = require.requireActual('modules/helpers');

  return {
    ...helpers,
    getUnixtime: () => 1234567890,
  };
});

describe('store', () => {
  it('should have a store', () => {
    expect(store.getState()).toEqual({
      _persist: { rehydrated: true, version: -1 },
      app: { alerts: [], isSidebarActive: false, version: 3 },
      color: { hex: '', instance: null, model: 'hsl', steps: 24, type: 'h' },
      router: { location: null },
      user: {
        colors: [],
        createdAt: 1234567890,
        showHelp: true,
        showStarterKit: true,
        updatedAt: 1234567890,
      },
    });
  });

  it('should have a persistor', () => {
    expect(persistor.getState()).toEqual({
      bootstrapped: true,
      registry: [],
    });
  });
});
