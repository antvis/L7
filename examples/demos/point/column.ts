import { PointLayer } from '@antv/l7';
import data from '../../data/shanghaixi-village.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const column: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'light',
      center: [121.400257, 31.25287],
      zoom: 14.55,
      pitch: 45,
    },
  });

  const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('name', ['cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'])
    .active(true)
    .size('unit_price', (h) => {
      return [6, 6, 100];
    })
    .color('name', ['#739DFF', '#61FCBF', '#FFDE74', '#FF896F'])
    .style({
      opacity: 1,
    });

  scene.addLayer(pointLayer);

  return scene;
};
