import { HeatmapLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const grid: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/3dadb1f5-8f54-4449-8206-72db6e142c40.json',
  ).then((res) => res.json());

  const layer = new HeatmapLayer({
    autoFit: true,
  })
    .source(data, {
      transforms: [
        {
          type: 'hexagon',
          size: 5 * 100000,
        },
      ],
    })
    .shape('circle')
    .active(false)
    .color('#aaa')
    .style({
      coverage: 0.7,
      angle: 0,
    });
  scene.addLayer(layer);

  return scene;
};
