import { HeatmapLayer } from '@antv/l7';
import data from '../../data/globe-earthquake-mag.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const hexagon: TestCase = async (options) => {
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
          type: 'hexagon',
          size: 100,
          field: 'h12',
          method: 'sum',
        },
      ],
    })
    .size('sum', [0, 60])
    .shape('squareColumn')
    .style({
      opacity: 1,
    })
    .active(true)
    .color(
      'sum',
      [
        '#094D4A',
        '#146968',
        '#1D7F7E',
        '#289899',
        '#34B6B7',
        '#4AC5AF',
        '#5FD3A6',
        '#7BE39E',
        '#A1EDB8',
        '#CEF8D6',
      ].reverse(),
    );

  scene.startAnimate();
  scene.addLayer(layer);
  scene.render();

  return scene;
};
