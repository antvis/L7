import { PointLayer } from '@antv/l7';
import Stats from 'stats.js';
import data from '../../data/globe-earthquake-mag.json';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const perf: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      pitch: 20,
      center: [120, 20],
      zoom: 3,
    },
  });

  data.features = [
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
    ...data.features,
  ];
  const pointLayer = new PointLayer({})
    .source(data)
    .shape('circle')
    .size(15)
    .color('mag', (mag) => {
      return mag > 4.5 ? '#5B8FF9' : '#5CCEA1';
    })
    .active(true)
    .style({
      opacity: 0.6,
      strokeWidth: 3,
    });
  scene.addLayer(pointLayer);

  // stats.js
  const stats = new Stats();
  stats.showPanel(0);
  const $stats = stats.dom;
  $stats.style.position = 'absolute';
  $stats.style.left = '0px';
  $stats.style.bottom = '0px';
  const dom = options.id as HTMLDivElement;
  dom.appendChild($stats);

  const tick = () => {
    stats.update();

    requestAnimationFrame(tick);
  };
  tick();

  return scene;
};
