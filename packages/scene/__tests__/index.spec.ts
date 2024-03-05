// @ts-ignore
import { TestScene } from '@antv/l7-test-utils';
import PolygonLayer from '../../layers/src/polygon';
describe('template', () => {
  const el = document.createElement('div');
  el.id = 'test-div-id';
  const body = document.querySelector('body') as HTMLBodyElement;
  body.appendChild(el);
  const scene = TestScene({
    center: [120.11114550000002, 30.27817071635984],
    zoom: 11.592359444611867,
  });
  const data = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {
          base_height: 100,
        },
        geometry: {
          type: 'Polygon',
          coordinates: [
            [
              [119.948198, 30.339818],
              [120.344273, 30.513865],
              [120.414729, 30.288859],
              [120.346177, 30.160522],
              [120.100535, 30.041909],
              [119.906306, 30.094644],
              [119.845646, 30.175339],
              [119.81137, 30.244454],
              [119.807562, 30.352965],
              [119.948198, 30.339818],
            ],
          ],
        },
      },
    ],
  };

  scene.on('loaded', () => {
    const layer = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .shape('fill')
      .active(true)
      .color('red');
    scene.addLayer(layer);
  });

  it('scene map status', async () => {
    // expect(scene.getBounds()).toEqual([
    //   [119.74680738328703, 30.041908999999805],
    //   [120.4754836167117, 30.513865000000024]
    // ]);
  });
});
