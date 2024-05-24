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
    'marker',
    'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ',
  );

  const pointLayer = new PointLayer({ layerType: 'fillImage' })
    .source(
      [
        {
          lng: 120,
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
    .style({
      unit: 'meter',
    })
    .shape('marker')
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
    .size(36)
    .active(true)
    .style({
      rotation: 90,
    });

  scene.addLayer(pointLayer);
  scene.addLayer(pointLayer2);

  return scene;
};
