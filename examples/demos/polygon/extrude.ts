import { PolygonLayer } from '@antv/l7';
import data from '../../data/nanjing-city.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const extrude: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
      pitch: 45,
    },
  });

  const filllayer = new PolygonLayer({
    name: 'fill',
    zIndex: 3,
    autoFit: true,
  })
    .source(data)
    .shape('extrude')
    .active(true)
    .size('unit_price', (unit_price) => unit_price)
    .color('count', ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'])
    .style({
      pickLight: true,
      opacity: 1,
    });
  scene.addLayer(filllayer);

  return scene;
};
