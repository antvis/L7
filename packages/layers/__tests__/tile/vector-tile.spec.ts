import { TestScene } from '@antv/l7-test-utils';
import PointLayer from '../../src/point';

describe('vector-tile', () => {
  let scene: any;
  beforeEach(() => {
    scene = TestScene();
  });
  it('pointLayer vector', async () => {
    const layer = new PointLayer({
      featureId: 'COLOR',
      sourceLayer: 'ecoregions2',
    });
    layer
      .source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf', {
        parser: {
          type: 'mvt',
          tileSize: 256,
          zoomOffset: 0,
          maxZoom: 9,
          extent: [-180, -85.051129, 179, 85.051129],
        },
      })
      .shape('circle')
      .color('COLOR')
      .size(10);

    scene.addLayer(layer);
    scene.setZoom(12);
  });
});
