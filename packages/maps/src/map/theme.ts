import { MapStyleConfig } from '@antv/l7-core';

export const MapTheme: MapStyleConfig = {
  normal: 'mapbox://styles/mapbox/streets-v11',
  light: 'mapbox://styles/zcxduo/ck2ypyb1r3q9o1co1766dex29',
  dark: 'mapbox://styles/zcxduo/ck241p6413s0b1cpayzldv7x7',
  blank: {
    version: 8,
    // sprite: 'https://lzxue.github.io/font-glyphs/sprite/sprite',
    // glyphs:
    //   'https://gw.alipayobjects.com/os/antvdemo/assets/mapbox/glyphs/{fontstack}/{range}.pbf',
    sources: {},
    layers: [
      {
        id: 'background',
        type: 'background',
        layout: {
          visibility: 'none',
        },
      },
    ],
  },
};
