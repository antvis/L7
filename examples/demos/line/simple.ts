import { LineLayer, Source } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const simple: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    },
  });

  const geoData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          offset: 0.3,
        },
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [99.228515625, 37.43997405227057],
              [100.72265625, 27.994401411046148],
              [110, 27.994401411046148],
              [110, 25],
              [100, 25],
            ],
            [
              [108.544921875, 37.71859032558816],
              [112.412109375, 32.84267363195431],
              [115, 32.84267363195431],
              [115, 35],
            ],
          ],
        },
      },
      {
        type: 'Feature',
        properties: {
          offset: 0.8,
        },
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [110, 30],
              [120, 30],
              [120, 40],
            ],
          ],
        },
      },
    ],
  };
  const source = new Source(geoData);
  const layer = new LineLayer({ autoFit: true })
    .source(source)
    .size(1)
    .shape('simple')
    .color('#f00');

  scene.addLayer(layer);

  return scene;
};
