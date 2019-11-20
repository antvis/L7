import { IEncodeFeature } from '@antv/l7-core';
import { polygonTriangulation } from '../../core/triangulation';

describe('PolygonTriangulation', () => {
  it('should do triangulation with a polygon correctly', () => {
    const mockFeature: IEncodeFeature = {
      coordinates: [
        [
          [0, 0],
          [1, 0],
          [1, 1],
          [0, 1],
        ],
      ],
      color: [1, 0, 0, 0],
    };
    const { indices, vertices, size } = polygonTriangulation(mockFeature);

    expect(indices).toEqual([2, 3, 0, 0, 1, 2]);
    expect(vertices).toEqual([0, 0, 1, 0, 1, 1, 0, 1]);
    expect(size).toEqual(2);
  });
});
