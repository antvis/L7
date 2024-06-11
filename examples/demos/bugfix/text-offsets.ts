import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const textOffsets: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const data = await fetch(
    'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
  ).then((res) => res.json());

  const circleLayer = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('circle')
    .color('#0f0')
    .size(5);
  const imageLayerText = new PointLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('name', 'text')
    .color('#f00')
    .size(10)
    .style({
      textOffset: {
        field: 'count',
        value: (v: number) => {
          return [0, v * 14];
        },
      },
    });

  scene.addLayer(imageLayerText);
  scene.addLayer(circleLayer);

  return scene;
};
