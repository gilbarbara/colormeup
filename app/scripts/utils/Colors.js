import _intersection from 'lodash/array/intersection';
import _pick from 'lodash/object/pick';
import _isEmpty from 'lodash/lang/isEmpty';
import { expr } from './Math';

/**
 * Colors
 * @class
 * @version 1.0
 */
class Colors {
  /**
   * @constructs Colors
   * @param {string|Array|Object} color
   */
  constructor(color = '#ff0044') {
    this.setColor(color);
  }

  /**
   * Change the main color.
   *
   * @param {string|Array|Object} color
   */
  setColor(color) {
    if (!color) {
      throw new Error('Not a valid color');
    }

    if (color instanceof Array && color.length === 3) {
      this.rgb = {
        r: this.bound(color[0], 'r'),
        g: this.bound(color[1], 'g'),
        b: this.bound(color[2], 'b')
      };

      this.hex = this.rgb2hex();
      this.hsl = this.rgb2hsl();
    }
    else if (color === Object(color)) {
      if (color.hasOwnProperty('h') && color.hasOwnProperty('s') && color.hasOwnProperty('l')) {
        this.hsl = {
          h: this.bound(color.h, 'h'),
          s: this.bound(color.s, 's'),
          l: this.bound(color.l, 'l')
        };
        this.rgb = this.hsl2rgb();
      }
      else if (color.hasOwnProperty('r') && color.hasOwnProperty('g') && color.hasOwnProperty('b')) {
        this.rgb = color;
        this.hsl = this.rgb2hsl();
      }
      else {
        throw new Error('Not a valid object');
      }

      this.hex = this.hsl2hex();
    }
    else if (typeof color === 'string') {
      this.hex = this.parseHex(color);
      this.rgb = this.hex2rgb();
      this.hsl = this.rgb2hsl();
    }
    else {
      throw new Error('Input not valid');
    }
  }

  /**
   * Convert a hex string to RGB object.
   *
   * @param {string} hex
   * @returns {{r: number, g: number, b: number}}
   */
  hex2rgb(hex = this.hex) {
    const newHex = this.parseHex(hex).substr(1);

    return {
      r: parseInt(String(newHex.charAt(0)) + newHex.charAt(1), 16),
      g: parseInt(String(newHex.charAt(2)) + newHex.charAt(3), 16),
      b: parseInt(String(newHex.charAt(4)) + newHex.charAt(5), 16)
    };
  }

  /**
   * Convert a hex string to HSL object.
   *
   * @param {string} hex
   * @returns {{h: number, s: number, l: number}}
   */
  hex2hsl(hex = this.hex) {
    const newHex = this.parseHex(hex).substr(1);

    return this.rgb2hsl({
      r: parseInt(String(newHex.charAt(0)) + newHex.charAt(1), 16),
      g: parseInt(String(newHex.charAt(2)) + newHex.charAt(3), 16),
      b: parseInt(String(newHex.charAt(4)) + newHex.charAt(5), 16)
    });
  }

  /**
   * Convert a RGB object to HSL.
   *
   * @param {Object|string} rgb
   * @returns {{h: number, s: number, l: number}}
   */
  rgb2hsl(rgb = this.rgb) {
    let newRGB = rgb;

    if (typeof rgb === 'string') {
      newRGB = this.parseRGB(rgb);
    }

    if (!newRGB.hasOwnProperty('r') || !newRGB.hasOwnProperty('g') || !newRGB.hasOwnProperty('b')) {
      throw new Error('hex2hsl::invalid object');
    }

    const r = this.bound(newRGB.r, 'r') / 255;
    const g = this.bound(newRGB.g, 'g') / 255;
    const b = this.bound(newRGB.b, 'b') / 255;

    const min = Math.min(r, g, b);
    const max = Math.max(r, g, b);
    const d = max - min;

    let h;
    let s;
    let l;

    switch (max) {
      case min:
        h = 0;
        break;
      case r:
        h = 60 * (g - b) / d;
        break;
      case g:
        h = 60 * (b - r) / d + 120;
        break;
      case b:
        h = 60 * (r - g) / d + 240;
        break;
      default:
        break;
    }
    if (h < 0) {
      h = 360 + h;
    }

    l = (max + min) / 2.0;

    if (min === max) {
      s = 0;
    }
    else {
      s = l < 0.5 ? d / (2 * l) : d / (2 - 2 * l);
    }

    return {
      h: Math.abs(+((h % 360).toFixed(2))),
      s: +((s * 100).toFixed(2)),
      l: +((l * 100).toFixed(2))
    };
  }

  /**
   * Convert a RGA object to hex.
   *
   * @param {Object|string} rgb
   *
   * @returns {string}
   */
  rgb2hex(rgb = this.rgb) {
    let newRGB = rgb;

    if (typeof rgb === 'string') {
      newRGB = this.parseRGB(rgb);
    }

    if (!newRGB.hasOwnProperty('r') || !newRGB.hasOwnProperty('g') || !newRGB.hasOwnProperty('b')) {
      throw new Error('rgb2hex::invalid object');
    }

    return `#${((1 << 24) + (newRGB.r << 16) + (newRGB.g << 8) + newRGB.b).toString(16).slice(1)}`;
  }

  /**
   * Convert a HSL object to RGB.
   *
   * @param {Object|string} hsl
   * @returns {{r: number, g: number, b: number}}
   */
  hsl2rgb(hsl = this.hsl) {
    let newHSL = hsl;

    if (typeof hsl === 'string') {
      newHSL = this.parseHSL(hsl);
    }

    if (!newHSL.hasOwnProperty('h') || !newHSL.hasOwnProperty('s') || !newHSL.hasOwnProperty('l')) {
      throw new Error('hsl2rgb::invalid object');
    }

    const h = parseFloat(newHSL.h).toFixed(2) / 360;
    const s = parseFloat(newHSL.s).toFixed(2) / 100;
    const l = parseFloat(newHSL.l).toFixed(2) / 100;

    let r;
    let g;
    let b;
    let p;
    let q;

    if (s === 0) {
      r = g = b = l;
    }
    else {
      q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      p = 2 * l - q;
      r = this.hue2rgb(p, q, h + 1 / 3);
      g = this.hue2rgb(p, q, h);
      b = this.hue2rgb(p, q, h - 1 / 3);
    }

    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    };
  }

  /**
   * Convert a HSL object to HEX.
   *
   * @param {Object} hsl
   * @returns {string}
   */
  hsl2hex(hsl = this.hsl) {
    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * @param {number} p
   * @param {number} q
   * @param {number} t
   *
   * @returns {*}
   */
  hue2rgb(p, q, t) {
    let newT = t;

    if (newT < 0) {
      newT += 1;
    }

    if (newT > 1) {
      newT -= 1;
    }

    if (newT < 1 / 6) {
      return p + (q - p) * 6 * newT;
    }

    if (newT < 1 / 2) {
      return q;
    }

    if (newT < 2 / 3) {
      return p + (q - p) * (2 / 3 - newT) * 6;
    }

    return p;
  }

  /**
   * Mod.
   *
   * @param {Object} attr
   * @returns {*}
   */
  mod(attr) {
    const newAttr = attr;
    const isHSL = _intersection(Object.keys(newAttr), ['h', 's', 'l']).length;
    const isRGB = _intersection(Object.keys(newAttr), ['r', 'g', 'b']).length;

    let hsl;
    let rgb;
    let out;
    let type;

    if (isRGB && isHSL) {
      throw new Error('Only use a single color model');
    }

    if (isRGB) {
      type = 'rgb';
    }
    else if (isHSL) {
      type = 'hsl';
    }
    else {
      return null;
    }

    Object.keys(newAttr).forEach(key => {
      if (newAttr[key] === null) {
        return delete newAttr[key];
      }
    });

    switch (type) {
      case 'rgb':
        rgb = _pick(newAttr, 'r', 'g', 'b');
        if (_isEmpty(rgb) === false) {
          out = Object.assign({}, this.rgb, rgb);
        }
        else {
          out = this.rgb;
        }
        break;
      case 'hsl':
        hsl = _pick(newAttr, 'h', 's', 'l');
        if (_isEmpty(hsl) === false) {
          out = Object.assign({}, this.hsl, hsl);
        }
        else {
          out = this.hsl;
        }
        break;
      default:
        break;
    }

    return out;
  }

  /**
   * Constrain.
   *
   * @param {number} attr
   * @param {number} amount
   * @param {Array} limit
   * @param {string} direction
   * @returns {number}
   */
  constrain(attr, amount, limit, direction) {
    let val = expr(attr + direction + amount);
    const test = (limit[1] >= val && val >= limit[0]);

    if (!test) {
      if (val < limit[0]) {
        val = limit[0];
      }

      if (val > limit[1]) {
        val = limit[1];
      }
    }

    return Math.abs(val);
  }

  /**
   * @param {number} attr
   * @param {number} amount
   * @returns {number}
   */
  constrainDegrees(attr, amount) {
    let val = attr + amount;

    if (val > 360) {
      val -= 360;
    }

    if (val < 0) {
      val += 360;
    }

    return Math.abs(val);
  }

  /**
   * @type {number}
   */
  get red() {
    return Number(this.rgb.r);
  }

  /**
   * @type {number}
   */
  get green() {
    return Number(this.rgb.g);
  }

  /**
   * @type {number}
   */
  get blue() {
    return Number(this.rgb.b);
  }

  /**
   * @type {number}
   */
  get hue() {
    return Number(this.hsl.h);
  }

  /**
   * @type {number}
   */
  get saturation() {
    return Number(this.hsl.s);
  }

  /**
   * @type {number}
   */
  get lightness() {
    return Number(this.hsl.l);
  }

  /**
   * Make the color lighter.
   *
   * @param {number} percentage
   * @returns {string}
   */
  lighten(percentage) {
    const hsl = this.mod({
      l: this.constrain(this.lightness, percentage, [0, 100], '+')
    });

    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * Make the color darker.
   *
   * @param {number} percentage
   * @returns {string}
   */
  darken(percentage) {
    const hsl = this.mod({
      l: this.constrain(this.lightness, percentage, [0, 100], '-')
    });

    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * Increase saturation.
   *
   * @param {number} percentage
   * @returns {string}
   */
  saturate(percentage) {
    const hsl = this.mod({
      s: this.constrain(this.saturation, percentage, [0, 100], '+')
    });

    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * Descrease saturation.
   *
   * @param {number} percentage
   * @returns {string}
   */
  desaturate(percentage) {
    const hsl = this.mod({
      s: this.constrain(this.saturation, percentage, [0, 100], '-')
    });

    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * Adjust the color hue.
   *
   * @param {number} degrees
   * @returns {string}
   */
  adjustHue(degrees) {
    const hsl = this.mod({
      h: this.constrainDegrees(this.hue, +degrees)
    });

    return this.rgb2hex(this.hsl2rgb(hsl));
  }

  /**
   * Alter color values.
   *
   * @param {Object} opts
   * @param {boolean} hex
   *
   * @returns {string}
   */
  remix(opts, hex = false) {
    const model = {};
    let mod;

    Object.keys(opts).forEach(o => {
      model[o] = opts[o];
    });

    mod = this.mod(model);

    if (hex) {
      return mod.r ? this.rgb2hex(mod) : this.hsl2hex(mod);
    }

    return mod;
  }

  /**
   * Parse HEX color.
   *
   * @param {string} hex
   *
   * @returns {string}
   */
  parseHex(hex) {
    const color = hex.replace('#', '');
    let newHex = '';

    if (color.length === 3) {
      color.split('').forEach(d => {
        newHex += d + d;
      });
    }
    else {
      newHex = color;
    }

    newHex = `#${newHex}`;

    if (!this.validHex(newHex)) {
      throw new Error('Not a valid color');
    }

    return newHex;
  }

  /**
   * Parse CSS rgb value.
   *
   * @param {string} rgb
   * @returns {Object}
   */
  parseRGB(rgb) {
    const matches = rgb.match(/^rgba?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    if (matches && matches.length === 4) {
      return {
        r: parseInt(matches[1], 10),
        g: parseInt(matches[2], 10),
        b: parseInt(matches[3], 10)
      };
    }

    throw new Error('Not a valid color');
  }

  /**
   * Parse CSS hsl value.
   *
   * @param {string} hsl
   * @returns {Object}
   */
  parseHSL(hsl) {
    const matches = hsl.match(/^hsla?[\s+]?\([\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?,[\s+]?(\d+)[\s+]?/i);
    if (matches && matches.length === 4) {
      return {
        h: parseInt(matches[1], 10),
        s: parseInt(matches[2], 10),
        l: parseInt(matches[3], 10)
      };
    }

    throw new Error('Not a valid color');
  }

  /**
   * Validate HEX color.
   *
   * @param {string} hex
   *
   * @returns {boolean}
   */
  validHex(hex) {
    return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(hex);
  }

  /**
   * Limit values per type.
   *
   * @param {number} value
   * @param {string} type
   * @returns {number}
   */
  bound(value, type) {
    if (typeof value !== 'number') {
      throw new Error('not a number');
    }
    if (['r', 'g', 'b'].indexOf(type) > -1) {
      return Math.max(Math.min(value, 255), 0);
    }
    else if (['s', 'l'].indexOf(type) > -1) {
      return Math.max(Math.min(value, 100), 0);
    }
    else if (type === 'h') {
      return Math.max(Math.min(value, 360), 0);
    }

    throw new Error('invalid type');
  }

  /**
   * Generate a color scheme.
   *
   * @param {Array} degrees - Ex: [0, 180] or [0, 120, 240].
   * @returns {Array}
   */
  schemeFromDegrees(degrees) {
    const newColors = [];
    for (let i = 0, j = degrees.length; i < j; i++) {
      const col = Object.assign({}, this.hsl);
      col.h = (col.h + degrees[i]) % 360;
      newColors.push(col);
    }
    return newColors;
  }

  /**
   * Generate a random color.
   *
   * @returns {{hex: string, rgb: Object, hsl: Object}}
   */
  random() {
    const hsl = {
      h: Math.floor(Math.random() * 360) + 1,
      s: Math.floor(Math.random() * 90) + 10,
      l: Math.floor(Math.random() * 80) + 10
    };

    return {
      hex: this.hsl2hex(hsl),
      rgb: this.hsl2rgb(hsl),
      hsl
    };
  }
}

export default Colors;
