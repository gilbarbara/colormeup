import reducer, { colorState, setColor, setOptions } from '~/store/slices/color';

describe('slices/color', () => {
  describe('actions', () => {
    it(`${setColor.type} should return properly`, () => {
      expect(setColor('#0f0')).toEqual({
        type: setColor.type,
        payload: '#0f0',
      });
    });

    it(`${setOptions.type} should return properly`, () => {
      expect(setOptions({ model: 'hsl' })).toEqual({
        type: setOptions.type,
        payload: { model: 'hsl' },
      });
    });
  });

  describe('reducers', () => {
    let color = reducer(colorState, { type: 'init' });

    it(`should handle ${setColor.type} action`, () => {
      color = reducer(color, setColor('#0f0'));
      expect(color).toEqual({ ...colorState, hex: '#0f0' });
    });

    it(`should handle ${setOptions.type} action`, () => {
      color = reducer(color, setOptions({ model: 'rgb', steps: 8 }));
      expect(color).toEqual({ ...colorState, hex: '#0f0', model: 'rgb', steps: 8 });
    });
  });

  describe('state', () => {
    const color = reducer(colorState, { type: 'init' });

    it('should return the initial state', () => {
      expect(reducer(color, { type: 'init' })).toEqual({
        hex: '#ff0044',
        model: 'hsl',
        steps: 16,
        type: 'h',
      });
    });
  });
});
