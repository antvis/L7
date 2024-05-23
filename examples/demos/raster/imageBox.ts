import { ImageLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const imageBox: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [115.5268, 34.3628],
      zoom: 7,
    },
  });

  const layer = new ImageLayer({
    autoFit: true,
  });
  layer.source(
    'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

    {
      parser: {
        type: 'image',
        coordinates: [
          [100.959388, 41.619522],
          [101.229887, 41.572654],
          [101.16971, 41.377836],
          [100.900015, 41.424628],
        ],
      },
    },
  );
  scene.addLayer(layer);

  return scene;
};
