import { LineLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const dash: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
  ).then((res) => res.json());

  const layer = new LineLayer({
    autoFit: true,
  })
    .source(data)
    .size('ELEV', (h) => {
      return [h % 50 === 0 ? 1.0 : 0.5, (h - 1400) * 20];
    })
    .shape('line')
    .scale('ELEV', {
      type: 'quantize',
    })
    .style({
      lineType: 'dash',
      opacity: 1,
      dashArray: [5, 5],
      heightfixed: true,
    })
    .color('ELEV', [
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
    ]);

  scene.addLayer(layer);

  return scene;
};
