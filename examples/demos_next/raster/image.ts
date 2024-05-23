import { ImageLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const image: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [115.5268, 34.3628],
      zoom: 7,
    },
  });

  const layer = new ImageLayer({});
  layer.source(
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8SUaRr7bxNsAAAAAAAAAAABkARQnAQ',
    {
      parser: {
        type: 'image',
        extent: [113.1277263548, 32.3464238863, 118.1365790452, 36.4786759137],
      },
    },
  );
  scene.addLayer(layer);

  return scene;
};
