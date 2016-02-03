import expect from 'expect';

import Colors from '../utils/Colors.js';

describe('Colors', () => {
  const color = new Colors('#ff0044');

  describe('initialization', () => {
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

  describe('parsers', () => {
    it('validHex should work', () => {
      expect(color.validHex('#aabbcc')).toBe(true);
      expect(color.validHex('#ff0044')).toBe(true);
      expect(color.validHex('00ff00')).toBe(false);
      expect(color.validHex('74422')).toBe(false);
    });

    it('parseHex should work with proper input', () => {
      expect(color.parseHex('#aabbcc')).toBe('#aabbcc');
      expect(color.parseHex('#ff0044')).toBe('#ff0044');
      expect(color.parseHex('00ff00')).toBe('#00ff00');
      expect(color.parseHex('#774422')).toBe('#774422');
    });

    it('parseHex should work with 3 digit hex', () => {
      expect(color.parseHex('#f05')).toBe('#ff0055');
      expect(color.parseHex('f0a')).toBe('#ff00aa');
      expect(color.parseHex('#abc')).toBe('#aabbcc');
      expect(color.parseHex('#07e')).toBe('#0077ee');
    });

    it('parseHex should throw error with invalid input', () => {
      expect(() => color.parseHex('#xyz')).toThrow(Error);
      expect(() => color.parseHex('#xml')).toThrow(Error);
      expect(() => color.parseHex('taa')).toThrow(Error);
      expect(() => color.parseHex('@jsl')).toThrow(Error);
    });

    it('parseRGB should work with proper input', () => {
      expect(color.parseRGB('rgb(255, 255, 0)')).toEqual({ r: 255, g: 255, b: 0 });
      expect(color.parseRGB('rgba(255, 127, 12, 0.5)')).toEqual({ r: 255, g: 127, b: 12 });
    });

    it('parseRGB should throw error with invalid input', () => {
      expect(() => color.parseRGB('rgs(255, 255, 0)')).toThrow(Error);
      expect(() => color.parseRGB([25, 56, 84])).toThrow(Error);
    });

    it('parseHSL should work with proper input', () => {
      expect(color.parseHSL('hsl(255, 80, 20)')).toEqual({ h: 255, s: 80, l: 20 });
      expect(color.parseHSL('hsla(126, 57, 62, 0.5)')).toEqual({ h: 126, s: 57, l: 62 });
    });

    it('parseHSL should throw error with invalid input', () => {
      expect(() => color.parseHSL('rgs(200, 55, 50)')).toThrow(Error);
      expect(() => color.parseHSL('1,50,50')).toThrow(Error);
    });
  });

  describe('converters', () => {
    it('hex2rgb should work with proper input', () => {
      expect(color.hex2rgb('#ff0044')).toEqual({ r: 255, g: 0, b: 68 });
      expect(color.hex2rgb('#abc')).toEqual({ r: 170, g: 187, b: 204 });
    });

    it('hex2rgb should throw error with invalid input', () => {
      expect(() => color.hex2rgb('abs')).toThrow(Error);
      expect(() => color.hex2rgb({ h: 240, s: 45, l: 50 })).toThrow(Error);
    });

    it('hex2hsl should work with proper input', () => {
      expect(color.hex2hsl('#ff0044')).toEqual({ h: 344, s: 100, l: 50 });
      expect(color.hex2hsl('#abc')).toEqual({ h: 210, s: 25, l: 73.33 });
    });

    it('hex2hsl should throw error with invalid input', () => {
      expect(() => color.hex2hsl('amanha')).toThrow(Error);
      expect(() => color.hex2hsl([255, 255, 0])).toThrow(Error);
    });

    it('rgb2hsl should work with proper input', () => {
      expect(color.rgb2hsl('rgb(255, 255, 0)')).toEqual({ h: 60, s: 100, l: 50 });
      expect(color.rgb2hsl({ r: 255, g: 55, b: 75 })).toEqual({ h: 354, s: 100, l: 60.78 });
    });

    it('rgb2hsl should throw error with invalid input', () => {
      expect(() => color.rgb2hsl('rgt(255, 255, 0)')).toThrow(Error);
      expect(() => color.rgb2hsl({ m: 255, t: 55, p: 75 })).toThrow(Error);
    });

    it('rgb2hex should work with proper input', () => {
      expect(color.rgb2hex('rgb(255, 255, 0)')).toEqual('#ffff00');
      expect(color.rgb2hex({ r: 255, g: 55, b: 75 })).toEqual('#ff374b');
    });

    it('rgb2hex should throw error with invalid input', () => {
      expect(() => color.rgb2hex('hpv(255, 255, 0)')).toThrow(Error);
      expect(() => color.rgb2hex({ m: 255, p: 55, b: 75 })).toThrow(Error);
    });

    it('hsl2rgb should work with proper input', () => {
      expect(color.hsl2rgb('hsl(255, 50, 50)')).toEqual({ r: 96, g: 64, b: 191 });
      expect(color.hsl2rgb({ h: 255, s: 55, l: 75 })).toEqual({ r: 174, g: 156, b: 226 });
    });

    it('hsl2rgb should throw error with invalid input', () => {
      expect(() => color.hsl2rgb('hpv(255, 255, 0)')).toThrow(Error);
      expect(() => color.hsl2rgb({ m: 255, p: 55, b: 75 })).toThrow(Error);
    });

    it('hsl2hex should work with proper input', () => {
      expect(color.hsl2hex('hsl(255, 50, 50)')).toEqual('#6040bf');
      expect(color.hsl2hex({ h: 255, s: 55, l: 75 })).toEqual('#ae9ce2');
    });

    it('hsl2hex should throw error with invalid input', () => {
      expect(() => color.hsl2hex('hpv(255, 255, 0)')).toThrow(Error);
      expect(() => color.hsl2hex({ m: 255, p: 55, b: 75 })).toThrow(Error);
    });
  });

  describe('utils', () => {
    it('hue2rgb should return median', () => {
      expect(color.hue2rgb(0.1, 0.4, 0.1)).toBe(0.28);
    });

    it('mod to work', () => {
      expect(color.mod({ h: 21, s: 50 })).toEqual({ h: 21, l: 50, s: 50 });
    });

    it('mod to fail', () => {
      expect(() => color.mod({ h: 21, r: 50 })).toThrow(Error);
    });

    it('constrain', () => {
      expect(color.constrain(20, 80, [40, 50], '+')).toBe(50);
      expect(color.constrain(90, 10, [40, 360], '+')).toBe(100);
    });
  });

  describe('methods', () => {
    it('setColor should change the initial parameters', () => {
      color.setColor('#0f4');
      expect(color.hex).toBe('#00ff44');

      color.setColor({ h: 240, s: 50, l: 50 });
      expect(color.hex).toBe('#4040bf');

      color.setColor([255, 65, 172]);
      expect(color.hex).toBe('#ff41ac');
    });

    it('setColor should throw error with invalid input', () => {
      expect(() => color.setColor('abs')).toThrow(Error);
      expect(() => color.setColor({ h: 240, s: 50, g: 50 })).toThrow(Error);

      expect(() => color.setColor([266, () => {}, 'hol'])).toThrow(Error); //eslint-disable-line arrow-body-style
    });
  });
});
