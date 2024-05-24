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
    'https://gw.alipayobjects.com/os/antfincdn/aBQAMIpvPL/qingdao_500m.csv',
  ).then((res) => res.text());

  const layer = new HeatmapLayer({
    autoFit: true,
  })
    .source(data, {
      parser: { type: 'csv', x: 'lng', y: 'lat' },
      transforms: [{ type: 'grid', size: 3000, field: 'count', method: 'sum' }],
    })
    .shape('square')
    .style({
      coverage: 0.9,
    })
    .color(
      'count',
      [
        '#FF3417',
        '#FF7412',
        '#FFB02A',
        '#FFE754',
        '#46F3FF',
        '#02BEFF',
        '#1A7AFF',
        '#0A1FB2',
      ].reverse(),
    );

  scene.addLayer(layer);

  return scene;
};
