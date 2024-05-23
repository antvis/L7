import { HeatmapLayer } from '@antv/l7';
import data from '../../data/globe-earthquake-mag.json';
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

  const layer = new HeatmapLayer({ autoFit: true })
    .source(data, {
      transforms: [
        {
          type: 'grid',
          size: 150000,
          field: 'mag',
          method: 'sum',
        },
      ],
    })
    .size('sum', (sum) => {
      return sum * 2000;
    })
    .shape('hexagonColumn')
    .style({
      coverage: 0.8,
      angle: 0,
    })
    .active(true)
    .color(
      'count',
      [
        '#0B0030',
        '#100243',
        '#100243',
        '#1B048B',
        '#051FB7',
        '#0350C1',
        '#0350C1',
        '#0072C4',
        '#0796D3',
        '#2BA9DF',
        '#30C7C4',
        '#6BD5A0',
        '#A7ECB2',
        '#D0F4CA',
      ].reverse(),
    );
  scene.addLayer(layer);

  return scene;
};
