module.exports = {
  colors: [
    '#ff002b',
    '#ff6e00',
    '#f7ff00',
    '#5eff00',
    '#00ff3b',
    '#00ffd4',
    '#0091ff',
    '#0800ff',
    '#a100ff',
    '#ff00c4',
  ],
  modes: {
    hsl: {
      h: {
        name: 'Hue',
        max: 360,
      },
      s: {
        name: 'Saturation',
        max: 100,
      },
      l: {
        name: 'Lightness',
        max: 100,
      },
    },
    rgb: {
      r: {
        name: 'Red',
        max: 255,
      },
      g: {
        name: 'Green',
        max: 255,
      },
      b: {
        name: 'Blue',
        max: 255,
      },
    },
  },
  features: {
    sidebar: true,
  },
};
