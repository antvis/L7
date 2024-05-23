import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const radar: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120, 30],
      zoom: 13,
    },
  });

  const layer = new PointLayer()
    .source([{ lng: 120, lat: 30 }], {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('radar')
    .size(100)
    .color('#d00')
    .style({
      speed: 5,
    })
    .animate(true);

  scene.addLayer(layer);

  return scene;
};
