import {
  createReducer,
  getColorModes,
  getUnixtime,
  isNumber,
} from 'modules/helpers';

describe('modules/helpers', () => {
  describe('createReducer', () => {
    const defaultState = { value: 1 };
    const reducer = createReducer(
      defaultState,
      {
        ACTION(state, action) {
          return { ...state, value: action.value };
        },
      });

    it('should return the default state', () => {
      expect(reducer(defaultState, { type: 'ACTION-2', value: 2 }))
        .toEqual({
          value: 1,
        });
    });

    it('should update the state value', () => {
      expect(reducer(defaultState, { type: 'ACTION', value: 2 }))
        .toEqual({
          value: 2,
        });
    });

    it('should not have mutated the default state', () => {
      expect(defaultState).toBe(defaultState);
    });
  });

  describe('getColorModes', () => {
    it('should return an array with the color modes', () => {
      expect(getColorModes()).toEqual([
        {
          name: 'hsl',
          types: [
            {
              key: 'h',
              max: 360,
              name: 'Hue',
              slug: 'hue',
            },
            {
              key: 's',
              max: 100,
              name: 'Saturation',
              slug: 'saturation',
            },
            {
              key: 'l',
              max: 100,
              name: 'Lightness',
              slug: 'lightness',
            },
          ],
        },
        {
          name: 'rgb',
          types: [
            {
              key: 'r',
              max: 255,
              name: 'Red',
              slug: 'red',
            },
            {
              key: 'g',
              max: 255,
              name: 'Green',
              slug: 'green',
            },
            {
              key: 'b',
              max: 255,
              name: 'Blue',
              slug: 'blue',
            },
          ],
        },
      ]
      );
    });
  });

  describe('getUnixtime', () => {
    it('should return a timestamp', () => {
      expect(getUnixtime()).toBeCloseTo(Math.floor(Date.now() / 1000));
    });
  });

  describe('isNumber', () => {
    it('should return a boolean', () => {
      expect(isNumber(1)).toBe(true);
      expect(isNumber('1')).toBe(true);
      expect(isNumber('a')).toBe(false);
      expect(isNumber([])).toBe(false);
    });
  });
});
