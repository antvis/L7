import { GeometryLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const snow: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      pitch: 40,
      style: 'dark',
      center: [120, 30],
      zoom: 6,
    },
  });

  const layer = new GeometryLayer()
    .shape('sprite')
    .size(10)
    .style({
      mapTexture:
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zLQwQKBSagYAAAAAAAAAAAAAARQnAQ', // snow
      center: [120, 30],
      spriteCount: 60,
      spriteRadius: 10,
      spriteTop: 300,
      spriteUpdate: 5,
    });
  scene.addLayer(layer);

  return scene;
};
