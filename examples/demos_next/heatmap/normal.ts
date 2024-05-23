import { HeatmapLayer } from '@antv/l7';
import data from '../../data/globe-earthquake-mag.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const normal: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const layer = new HeatmapLayer({ autoFit: true })
    .source(data)
    .shape('heatmap')
    .size('mag', [0, 1.0]) // weight映射通道
    .style({
      intensity: 2,
      radius: 20,
      opacity: 1.0,
      rampColors: {
        colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'].reverse(),
        positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      },
    });
  scene.addLayer(layer);
  layer.on('inited', () => {
    console.log(layer.getLegend('color'));
  });

  return scene;
};
