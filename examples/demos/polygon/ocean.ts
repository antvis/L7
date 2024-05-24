import { PolygonLayer } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const ocean: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const layer = new PolygonLayer({
    autoFit: true,
  })
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [104.4140625, 35.460669951495305],
                [98.7890625, 24.206889622398023],
                [111.796875, 27.371767300523047],
                [104.4140625, 35.460669951495305],
              ],
            ],
          },
        },
      ],
    })
    .shape('ocean')
    .animate(true)
    .color('#f00')
    .style({
      watercolor: '#6D99A8',
    });

  scene.addLayer(layer);

  return scene;
};
