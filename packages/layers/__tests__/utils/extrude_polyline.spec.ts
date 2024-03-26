import { aProjectFlat } from '@antv/l7-utils';

import ExtrudePolyLine from '../../src/utils/extrude_polyline';

describe('extrude polyline', () => {
  const coords = [
    [57.65624999999999, 55.178867663281984],
    [74.8828125, 54.77534585936447],
    [74.8828125, 49.83798245308484],
  ];
  const extrude = new ExtrudePolyLine({
    thickness: 1,
  });
  it('extrude line', () => {
    coords.forEach((coord) => {
      const [lng, lat] = aProjectFlat(coord);
      coord[0] = lng;
      coord[1] = lat;
    });
    const mesh = extrude.extrude(coords);
    expect(mesh.indices.length).toBe(12);
  });
});
