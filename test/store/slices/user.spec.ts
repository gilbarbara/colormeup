import reducer, {
  removeColor,
  resetUserData,
  saveColor,
  setUserOptions,
  userState,
} from '~/store/slices/user';

vi.mock('@gilbarbara/helpers', () => {
  const helpers = vi.importActual('@gilbarbara/helpers');

  return {
    ...helpers,
    now: () => 1234567890,
  };
});

describe('slices/user', () => {
  describe('actions', () => {
    it(`${saveColor.type} should return properly`, () => {
      expect(saveColor('#0f0')).toEqual({
        type: saveColor.type,
        payload: {
          color: '#0f0',
          updatedAt: 1234567890,
        },
      });
    });

    it(`${removeColor.type} should return properly`, () => {
      expect(removeColor('#0f0')).toEqual({
        type: removeColor.type,
        payload: {
          color: '#0f0',
          updatedAt: 1234567890,
        },
      });
    });

    it(`${resetUserData.type} should return properly`, () => {
      expect(resetUserData()).toEqual({
        type: resetUserData.type,
      });
    });

    it(`${setUserOptions.type} should return properly`, () => {
      expect(setUserOptions({ showHelp: false })).toEqual({
        type: setUserOptions.type,
        payload: { showHelp: false, updatedAt: 1234567890 },
      });
    });
  });

  describe('reducers', () => {
    let user = reducer(userState, { type: 'init' });

    it(`should handle ${saveColor.type} action`, () => {
      user = reducer(user, saveColor('#0f0'));
      expect(user).toEqual({ ...userState, colors: ['#0f0'] });
    });

    it(`should handle ${removeColor.type} action`, () => {
      user = reducer(user, removeColor('#0f0'));
      expect(user).toEqual({ ...userState, colors: [] });
    });

    it(`should handle ${setUserOptions.type} action`, () => {
      user = reducer(user, setUserOptions({ showHelp: false }));
      expect(user).toEqual({ ...userState, showHelp: false });
    });

    it(`should handle ${resetUserData.type} action`, () => {
      user = reducer(user, resetUserData());
      expect(user).toEqual(userState);
    });
  });

  describe('state', () => {
    const user = reducer(userState, { type: 'init' });

    it('should return the initial state', () => {
      expect(reducer(user, { type: 'init' })).toEqual({
        colors: [],
        createdAt: 1234567890,
        showHelp: true,
        updatedAt: 1234567890,
      });
    });
  });
});
