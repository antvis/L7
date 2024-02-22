import ImageLayer from '../index';
import { TestScene } from '@antv/l7-test-utils';
describe('ImageLayer', () => {
  let scene: any;

  beforeEach(() => {
    scene = TestScene();
  });
  it('ImageLayer test', () => {
    const layer = new ImageLayer({});
    layer.source(
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8SUaRr7bxNsAAAAAAAAAAABkARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [113.1277263548, 32.3464238863, 118.1365790452, 36.4786759137]
        }
      }
    ).style({
      brightness: 1,
      gamma: 1.0,
      opacity: 1.0,
      saturation: 10,
      contrast: 1,
    });
    scene.addLayer(layer);
  });
});
