import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const dot: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [116.417463, 40.015175],
      zoom: 8,
      minZoom: 5,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/antfincdn/8Ps2h%24qgmk/traffic_110000.csv',
  ).then((res) => res.text());

  const colors = ['#c57f34', '#cbfddf', '#edea70', '#8cc9f1', '#2c7bb6'];
  const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'csv',
        y: 'lat',
        x: 'lng',
      },
    })
    .shape('dot')
    .size(0.5)
    .color('type', (type) => {
      switch (parseInt(type)) {
        case 3:
          return colors[0];
        case 4:
          return colors[1];
        case 41:
          return colors[2];
        case 5:
          return colors[3];
        default:
          return colors[4];
      }
    });

  scene.addLayer(pointLayer);

  return scene;
};
