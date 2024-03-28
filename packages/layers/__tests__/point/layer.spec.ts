import { TestScene } from '@antv/l7-test-utils';
import PointLayer from '../../src/point';
import extrudePolygon from '../../src/point/shape/extrude';
describe('pointLayer', () => {
  const scene = TestScene();
  const extrude = extrudePolygon([
    // @ts-ignore
    [0, 1, 1],
    // @ts-ignore
    [0, 1, 0],
  ]);

  it('init', () => {
    expect(extrude).toEqual({
      positions: [
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        0,
        undefined,
        undefined,
        0,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        1,
        undefined,
        undefined,
        0,
        undefined,
        undefined,
        0,
      ],
      index: [1, 2, 0, 3, 2, 1, 5, 6, 4, 7, 6, 5],
    });
  });
  it('pontlayer fill', () => {
    const layer = new PointLayer({
      name: 'layer',
    })
      .source(
        [
          {
            lng: 120,
            lat: 30,
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
      .shape('circle')
      .size(10)
      .color('red')
      .style({ opacity: 0.5 });
    scene.addLayer(layer);
  });
});
