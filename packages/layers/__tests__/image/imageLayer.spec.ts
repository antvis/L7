import { TestScene } from '@antv/l7-test-utils';
import ImageLayer from '../../src/image/index';
describe('ImageLayer', () => {
  let scene: any;

  beforeEach(() => {
    scene = TestScene();
  });
  it('ImageLayer test', () => {
    const layer = new ImageLayer({});
    layer
      .source(
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8SUaRr7bxNsAAAAAAAAAAABkARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [113.1277263548, 32.3464238863, 118.1365790452, 36.4786759137],
          },
        },
      )
      .style({
        brightness: 1,
        gamma: 1.0,
        opacity: 1.0,
        saturation: 10,
        contrast: 1,
      });
    scene.addLayer(layer);
  });
  it('ImageLayer coord extent test', () => {
    const layer = new ImageLayer({});
    layer.source(
      'https://mdn.alipayobjects.com/huamei_gjo0cl/afts/img/A*vm_9S64uA0UAAAAAAAAAAAAADjDHAQ/original',

      {
        parser: {
          type: 'image',
          coordinates: [
            [100.959388, 41.619522],
            [101.229887, 41.572654],
            [101.16971, 41.377836],
            [100.900015, 41.424628],
          ],
        },
      },
    );
    scene.addLayer(layer);
  });
});
