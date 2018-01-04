import {
  initialize,
  setColor,
  setOptions,
} from 'actions/color';

describe('actions/color', () => {
  describe('initialize', () => {
    it('should return an action', () => {
      expect(initialize({})).toEqual({
        type: 'INITIALIZE',
        payload: { instance: {} },
      });
    });
  });

  describe('setColor', () => {
    it('should return an action', () => {
      expect(setColor('#00ff00')).toEqual({
        type: 'SET_COLOR',
        payload: {
          hex: '#00ff00',
        },
      });
    });
  });

  describe('setOptions', () => {
    it('should return an action', () => {
      expect(setOptions({ mode: 'hsl' })).toEqual({
        type: 'SET_OPTIONS',
        payload: { mode: 'hsl' },
      });
    });
  });
});
