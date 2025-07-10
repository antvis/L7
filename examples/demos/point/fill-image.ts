import { PointLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const fillImage: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [120, 30],
      pitch: 0,
      zoom: 14,
    },
  });

  await scene.addImage(
    'car',
    'https://mdn.alipayobjects.com/huamei_qa8qxu/afts/img/A*AtZnTYIlkbwAAAAAQGAAAAgAemJ7AQ/original',
  );
  await scene.addImage(
    'marker',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ',
  );

  const pointLayer = new PointLayer({ layerType: 'fillImage' })
    .source(
      [
        {
          lng: 120,
          lat: 30,
          name: 'car',
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .style({
      rotation: 0,
    })
    .shape('car')
    .size(36);

  const pointLayer2 = new PointLayer({ layerType: 'fillImage' })
    .source(
      [
        {
          lng: 120.01,
          lat: 30,
          name: 'marker',
        },
      ],
      {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      },
    )
    .shape('marker')
    .size(20)
    .active(true)
    .style({
      rotation: 0,
    });

  scene.addLayer(pointLayer);
  scene.addLayer(pointLayer2);

  return scene;
};
