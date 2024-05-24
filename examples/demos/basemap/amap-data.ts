import { LineLayer, Source } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const amapData: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      center: [121.434765, 31.256735],
      zoom: 14.83,
      maxZoom: 25,
    },
  });

  const geoData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.104021, 30.262493],
            [120.103875, 30.262601],
            [120.103963, 30.262694],
          ],
        },
      },
    ],
  };

  const source = new Source(geoData);
  const layer = new LineLayer({ blend: 'normal', autoFit: true })
    .source(source)
    .size(2)
    .shape('line')
    .color('#f00')
    .style({
      opacity: 1,
    });
  scene.addLayer(layer);

  return scene;
};
