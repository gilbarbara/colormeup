import reducer from 'reducers/user';

jest.mock('modules/helpers', () => {
  const helpers = require.requireActual('modules/helpers');

  return {
    ...helpers,
    getUnixtime: () => 1234567890,
  };
});

describe('reducers/user', () => {
  it('should return the initial state', () => {
    expect(reducer.user(undefined, {})).toEqual({
      colors: [],
      createdAt: 1234567890,
      showHelp: true,
      showStarterKit: true,
      updatedAt: 1234567890,
    });
  });
});
