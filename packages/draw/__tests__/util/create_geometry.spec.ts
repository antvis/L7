import { Feature, Geometry, point, Properties } from '@turf/helpers';
import {
  createCircle,
  createPoint,
  createPolygon,
  createRect,
} from '../../src/util/create_geometry';
const circleData = {
  type: 'Feature',
  properties: {
    units: 'kilometers',
    steps: 4,
    id: '1',
    pointFeatures: [
      {
        type: 'Feature',
        properties: {},
        geometry: { type: 'Point', coordinates: [113, 40] },
      },
    ],
    active: true,
    type: 'circle',
    radius: 1115.6518229264275,
    startPoint: { lng: 112, lat: 30 },
    endPoint: { lng: 113, lat: 40 },
  },
  geometry: {
    type: 'Polygon',
    coordinates: [
      [
        [112, 40.03328403184138],
        [100.45355724910682, 29.495378543228927],
        [112, 19.966715968158613],
        [123.54644275089319, 29.495378543228927],
        [112, 40.03328403184138],
      ],
    ],
  },
};
describe('creat_geometry', () => {
  it('creatCircle', () => {
    const circle = createCircle([112, 30], [113, 40], {
      units: 'kilometers',
      steps: 4,
      id: '1',
      pointFeatures: [point([113, 40])],
    });
    expect(circleData).toEqual(circle);
  });
});
