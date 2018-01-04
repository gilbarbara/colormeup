import reducer from 'reducers/color';

describe('reducers/color', () => {
  it('should return the initial state', () => {
    expect(reducer.color(undefined, {})).toEqual({
      hex: '',
      instance: null,
      model: 'hsl',
      steps: 24,
      type: 'h',
    });
  });
});
