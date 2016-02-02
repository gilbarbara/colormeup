import expect from 'expect';

import Colors from '../utils/Colors.js';

describe('Colors', () => {
  const color = new Colors('#ff0044');

  describe('init', () => {
    it('should create a new instance of Colors', () => {
      expect(color).toBeA(Colors);
    });
  });

  describe('instance', () => {
    it('should have an hex property', () => {
      expect(color.hex).toBe('#ff0044');
    });

    it('should have an hsl property', () => {
      expect(color.hsl).toBeA(Object);
      expect(color.hsl.h).toBe(344);
    });

    it('should have a rgb property', () => {
      expect(color.rgb).toBeA(Object);
      expect(color.rgb.r).toBe(255);
    });

    it('should have a setColor method', () => {
      expect(color.setColor).toBeA(Function);
    });
  });

  describe('methods', () => {
    it('parseHex should work with 3 digit hex', () => {
      expect(color.parseHex('#f05')).toBe('#ff0055');
      expect(color.parseHex('#f0a')).toBe('#ff00aa');
      expect(color.parseHex('#abc')).toBe('#aabbcc');
      expect(color.parseHex('#07e')).toBe('#0077ee');
    });

    it('parseHex should fail with invalid input', () => {
      expect((hex) => {
        color.parseHex(hex);
      }).withArgs('#fff').toThrow(/Not a valid color/);
    });
  });
});
