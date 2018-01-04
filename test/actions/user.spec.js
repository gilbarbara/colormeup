import {
  removeColor,
  resetUserData,
  saveColor,
  setUserOptions,
} from 'actions/user';

jest.mock('modules/helpers', () => ({
  getUnixtime: () => 1234567890,
}));

describe('actions/color', () => {
  describe('removeColor', () => {
    it('should return an action', () => {
      expect(removeColor('#00ff00')).toEqual({
        type: 'REMOVE_COLOR',
        payload: { color: '#00ff00' },
        meta: { updatedAt: 1234567890 },
      });
    });
  });

  describe('resetUserData', () => {
    it('should return an action', () => {
      expect(resetUserData()).toEqual({
        type: 'RESET_USER_DATA',
        payload: {},
      });
    });
  });

  describe('saveColor', () => {
    it('should return an action', () => {
      expect(saveColor('#ff00ff')).toEqual({
        type: 'SAVE_COLOR',
        payload: { color: '#ff00ff' },
        meta: { updatedAt: 1234567890 },
      });
    });
  });

  describe('setUserOptions', () => {
    it('should return an action', () => {
      expect(setUserOptions({ showHelp: true })).toEqual({
        type: 'SET_USER_OPTIONS',
        payload: { showHelp: true },
        meta: { updatedAt: 1234567890 },
      });
    });
  });
});
