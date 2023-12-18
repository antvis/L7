import type { FeatureCollection, Geometries, Properties } from '@turf/helpers';

const MultiLine: FeatureCollection<Geometries, Properties> = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'MultiLineString',
        coordinates: [
          [
            [100.0, 0.0],
            [101.0, 1.0],
          ],
          [
            [102.0, 2.0],
            [103.0, 3.0],
          ],
        ],
      },
    },
  ],
};

export default MultiLine;
