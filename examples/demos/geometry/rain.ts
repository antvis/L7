import { GeometryLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const rain: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      pitch: 90,
      style: 'dark',
      center: [120, 30],
      zoom: 6,
    },
  });

  const layer = new GeometryLayer()
    .shape('sprite')
    .size(10)
    .style({
      opacity: 0.3,
      mapTexture:
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*w2SFSZJp4nIAAAAAAAAAAAAAARQnAQ', // rain
      center: [120, 30],
      spriteCount: 120,
      spriteRadius: 10,
      spriteTop: 300,
      spriteUpdate: 10,
      spriteScale: 0.8,
    });
  scene.addLayer(layer);

  return scene;
};
