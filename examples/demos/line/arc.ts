import { LineLayer, PointLayer, Source } from '@antv/l7';
import type { TestCase } from '../../types';
import { CaseScene } from '../../utils';

export const arc: TestCase = async (options) => {
  const scene = await CaseScene({
    ...options,
    mapConfig: {
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
          offset: 0.8,
        },
        geometry: {
          type: 'MultiLineString',
          coordinates: [
            [
              [116.43, 39.97],
              [121.467025, 31.2327],
            ],
          ],
        },
      },
    ],
  };

  const geoData2 = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          offset: 0.3,
        },
        geometry: {
          type: 'LineString',
          coordinates: [
            [112.548194, 37.786985],
            [102.92417, 24.9848],
          ],
        },
      },
    ],
  };
  const source = new Source(geoData);
  const source2 = new Source(geoData2);

  const layer = new LineLayer({ blend: 'normal', autoFit: true })
    .source(source)
    .size(2)
    .shape('arc')
    .color('#f00')
    .style({
      // lineType:'dash',
      // thetaOffset: 'offset'
      // segmentNumber: 10,
      thetaOffset: 0.5,
    });
  const layer2 = new LineLayer({ blend: 'normal' })
    .source(source2)
    .size(2)
    .shape('arc')
    .color('#f00')
    .style({
      lineType: 'dash',
      // thetaOffset: 'offset'
      // segmentNumber: 10,
      thetaOffset: 0.5,
    });

  const point = new PointLayer({ blend: 'normal', zIndex: 1 })
    .source(
      [
        { lng: 116.43, lat: 39.97 },
        { lng: 108.39, lat: 22.91 },
      ],
      {
        parser: { type: 'json', x: 'lng', y: 'lat' },
      },
    )
    .shape('circle')
    .size(10)
    .color('blue');

  scene.addLayer(point);
  scene.addLayer(layer);
  scene.addLayer(layer2);

  return scene;
};
