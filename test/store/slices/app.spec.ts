import reducer, { appState, toggleSidebar } from '~/store/slices/app';

describe('slicers/app', () => {
  describe('actions', () => {
    it(`${toggleSidebar.type}should return properly`, () => {
      expect(toggleSidebar(true)).toEqual({
        type: 'app/toggleSidebar',
        payload: true,
      });
    });
  });

  describe('reducers', () => {
    let app = reducer(appState, { type: 'init' });

    it(`should handle ${toggleSidebar.type} action`, () => {
      app = reducer(app, toggleSidebar());
      expect(app.isSidebarOpen).toBe(true);

      app = reducer(app, toggleSidebar(false));
      expect(app.isSidebarOpen).toBe(false);
    });
  });

  describe('state', () => {
    const app = reducer(appState, { type: 'init' });

    it('should return the initial state', () => {
      expect(reducer(app, { type: 'init' })).toEqual({
        isSidebarOpen: false,
      });
    });
  });
});
