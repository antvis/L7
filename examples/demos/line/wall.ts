import { LineLayer } from '@antv/l7';
import data from '../../data/hunan-citys.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const wall: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
      pitch: 45,
    },
  });

  const layer = new LineLayer({
    autoFit: true,
  })
    .source(data)
    .size(100000)
    .shape('wall')
    .style({
      opacity: 0.4,
      sourceColor: '#0DCCFF',
      targetColor: 'rbga(255,255,255, 0)',
      heightfixed: true,
    });

  scene.addLayer(layer);

  return scene;
};
