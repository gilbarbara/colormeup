import reducer from 'reducers/app';
import { hideAlert, showAlert, toggleSidebar } from 'actions/app';
import { AppConstants } from 'constants/index';

describe('reducers/app', () => {
  let app = reducer.app(undefined, {});

  it('should return the initial state', () => {
    expect(reducer.app(app, {})).toEqual({
      alerts: [],
      isSidebarActive: false,
      version: 3,
    });
  });

  it(`should handle ${AppConstants.SHOW_ALERT}`, () => {
    app = reducer.app(app, showAlert('HELLO', { id: 'test', type: 'success' }));
    expect(app.alerts.length).toBe(1);
  });

  it(`should handle ${AppConstants.HIDE_ALERT}`, () => {
    app = reducer.app(app, hideAlert('test'));
    expect(app.alerts.length).toBe(0);
  });

  it(`should handle ${AppConstants.TOGGLE_SIDEBAR}`, () => {
    app = reducer.app(app, toggleSidebar());
    expect(app.isSidebarActive).toBe(true);

    app = reducer.app(app, toggleSidebar(false));
    expect(app.isSidebarActive).toBe(false);
  });
});
