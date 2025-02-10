import { getColorModes, isNumber } from '~/modules/helpers';

describe('modules/helpers', () => {
  describe('getColorModes', () => {
    it('should return an array with the color modes', () => {
      expect(getColorModes()).toMatchSnapshot();
    });
  });

  describe('isNumber', () => {
    it('should return a boolean', () => {
      expect(isNumber(1)).toBe(true);
      expect(isNumber('1')).toBe(false);
      expect(isNumber('a')).toBe(false);
    });
  });
});
