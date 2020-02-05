// code from https://github.com/santilland/plotty/blob/master/src/colorscales.js
export const colorScales: {
  [key: string]: any;
} = {
  rainbow: {
    colors: [
      '#96005A',
      '#0000C8',
      '#0019FF',
      '#0098FF',
      '#2CFF96',
      '#97FF00',
      '#FFEA00',
      '#FF6F00',
      '#FF0000',
    ],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
  },
  jet: {
    colors: ['#000083', '#003CAA', '#05FFFF', '#FFFF00', '#FA0000', '#800000'],
    positions: [0, 0.125, 0.375, 0.625, 0.875, 1],
  },
  hsv: {
    colors: [
      '#ff0000',
      '#fdff02',
      '#f7ff02',
      '#00fc04',
      '#00fc0a',
      '#01f9ff',
      '#0200fd',
      '#0800fd',
      '#ff00fb',
      '#ff00f5',
      '#ff0006',
    ],
    positions: [
      0,
      0.169,
      0.173,
      0.337,
      0.341,
      0.506,
      0.671,
      0.675,
      0.839,
      0.843,
      1,
    ],
  },
  hot: {
    colors: ['#000000', '#e60000', '#ffd200', '#ffffff'],
    positions: [0, 0.3, 0.6, 1],
  },
  cool: {
    colors: ['#00ffff', '#ff00ff'],
    positions: [0, 1],
  },
  spring: {
    colors: ['#ff00ff', '#ffff00'],
    positions: [0, 1],
  },
  summer: {
    colors: ['#008066', '#ffff66'],
    positions: [0, 1],
  },
  autumn: {
    colors: ['#ff0000', '#ffff00'],
    positions: [0, 1],
  },
  winter: {
    colors: ['#0000ff', '#00ff80'],
    positions: [0, 1],
  },
  bone: {
    colors: ['#000000', '#545474', '#a9c8c8', '#ffffff'],
    positions: [0, 0.376, 0.753, 1],
  },
  copper: {
    colors: ['#000000', '#ffa066', '#ffc77f'],
    positions: [0, 0.804, 1],
  },
  greys: {
    colors: ['#000000', '#ffffff'],
    positions: [0, 1],
  },
  yignbu: {
    colors: [
      '#081d58',
      '#253494',
      '#225ea8',
      '#1d91c0',
      '#41b6c4',
      '#7fcdbb',
      '#c7e9b4',
      '#edf8d9',
      '#ffffd9',
    ],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
  },
  greens: {
    colors: [
      '#00441b',
      '#006d2c',
      '#238b45',
      '#41ab5d',
      '#74c476',
      '#a1d99b',
      '#c7e9c0',
      '#e5f5e0',
      '#f7fcf5',
    ],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
  },
  wind: {
    colors: [
      '#3288bd',
      '#66c2a5',
      '#abdda4',
      '#e6f598',
      '#fee08b',
      '#fdae61',
      '#f46d43',
      '#d53e4f',
    ],
    positions: [0, 0.1, 0.2, 0.6, 0.7, 0.8, 0.9, 1],
  },
  yiorrd: {
    colors: [
      '#800026',
      '#bd0026',
      '#e31a1c',
      '#fc4e2a',
      '#fd8d3c',
      '#feb24c',
      '#fed976',
      '#ffeda0',
      '#ffffcc',
    ],
    positions: [0, 0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1],
  },
  bluered: {
    colors: ['#0000ff', '#ff0000'],
    positions: [0, 1],
  },
  rdbu: {
    colors: ['#050aac', '#6a89f7', '#bebebe', '#dcaa84', '#e6915a', '#b20a1c'],
    positions: [0, 0.35, 0.5, 0.6, 0.7, 1],
  },
  picnic: {
    colors: [
      '#0000ff',
      '#3399ff',
      '#66ccff',
      '#99ccff',
      '#ccccff',
      '#ffffff',
      '#ffccff',
      '#ff99ff',
      '#ff66cc',
      '#ff6666',
      '#ff0000',
    ],
    positions: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1],
  },
  portland: {
    colors: ['#0c3383', '#0a88ba', '#f2d338', '#f28f38', '#d91e1e'],
    positions: [0, 0.25, 0.5, 0.75, 1],
  },
  blackbody: {
    colors: ['#000000', '#e60000', '#e6d200', '#ffffff', '#a0c8ff'],
    positions: [0, 0.2, 0.4, 0.7, 1],
  },
  earth: {
    colors: ['#000082', '#00b4b4', '#28d228', '#e6e632', '#784614', '#ffffff'],
    positions: [0, 0.1, 0.2, 0.4, 0.6, 1],
  },
  electric: {
    colors: ['#000000', '#1e0064', '#780064', '#a05a00', '#e6c800', '#fffadc'],
    positions: [0, 0.15, 0.4, 0.6, 0.8, 1],
  },
};
// export default colorScales;
