import { Feature, Geometry, Properties } from '@turf/helpers';
import moveFeature from '../../src/util/move_featrues';
describe('moveFeature', () => {
  const delta = {
    lng: 1,
    lat: 1,
  };
  const pointFeature: Feature<Geometry, Properties> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Point',
      coordinates: [130, 47],
    },
  };
  const polyon: Feature<Geometry, Properties> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [
        [
          [49.5703125, 45.583289756006316],
          [71.3671875, 45.583289756006316],
          [71.3671875, 57.136239319177434],
          [49.5703125, 57.136239319177434],
          [49.5703125, 45.583289756006316],
        ],
      ],
    },
  };

  const line: Feature<Geometry, Properties> = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'LineString',
      coordinates: [
        [54.31640625, 62.91523303947614],
        [71.015625, 62.59334083012024],
        [70.48828125, 58.07787626787517],
        [77.16796875, 54.36775852406841],
        [83.3203125, 58.26328705248601],
        [83.3203125, 66.37275500247455],
        [94.74609375, 66.65297740055279],
        [94.74609375, 62.512317938386914],
      ],
    },
  };
  it('move Point', () => {
    const res = moveFeature([pointFeature], delta);
    expect(res[0].geometry.coordinates).toEqual([131, 48]);
  });
  it('move BBox', () => {
    const res = moveFeature([polyon], delta);
    expect(res[0].geometry.coordinates).toEqual([
      [
        [50.5703125, 46.583289756006316],
        [72.3671875, 46.583289756006316],
        [72.3671875, 58.136239319177434],
        [50.5703125, 58.136239319177434],
        [50.5703125, 46.583289756006316],
      ],
    ]);
  });
  it('move line', () => {
    const res = moveFeature([line], delta);
    expect(res[0].geometry.coordinates).toEqual([
      [55.31640625, 63.91523303947614],
      [72.015625, 63.59334083012024],
      [71.48828125, 59.07787626787517],
      [78.16796875, 55.36775852406841],
      [84.3203125, 59.26328705248601],
      [84.3203125, 67.37275500247455],
      [95.74609375, 67.65297740055279],
      [95.74609375, 63.512317938386914],
    ]);
  });
});
