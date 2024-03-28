import { TestScene } from '@antv/l7-test-utils';
import GeometryLayer from '../../src/geometry/index';

describe('GeometryLayer', () => {
  let scene: any;
  beforeEach(() => {
    scene = TestScene();
  });
  it('GeometryLayer  sprite', () => {
    const layer = new GeometryLayer()
      .shape('sprite')
      .size(20)
      .style({
        // opacity: 0.3,
        mapTexture:
          'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*zLQwQKBSagYAAAAAAAAAAAAAARQnAQ', // snowub
        center: [120, 30],
        // spriteAnimate: 'up',
        spriteCount: 60,
        spriteRadius: 10,
        spriteTop: 2500000,
        spriteUpdate: 10000,
        spriteScale: 0.8,
      })
      .active(true)
      .color('#f00');

    scene.addLayer(layer);
  });
  it('GeometryLayer  plane', () => {
    const layer = new GeometryLayer()
      .shape('plane')
      .style({
        opacity: 0.8,
        width: 0.074,
        height: 0.061,
        center: [120.1025, 30.2594],
      })
      .active(true)
      .color('#ff0');
    scene.addLayer(layer);
  });
});
