import { TestScene } from '@antv/l7-test-utils';
import WindLayer from '../../src/wind/index';

describe('WindLayer', () => {
  let scene: any;
  beforeEach(() => {
    scene = TestScene();
  });
  it('WindLayer', () => {
    const layer = new WindLayer({});
    layer
      .source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*wcU8S5xMEDYAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [-180, -85, 180, 85],
          },
        },
      )
      .animate(true)
      .style({
        uMin: -21.32,
        uMax: 26.8,
        vMin: -21.57,
        vMax: 21.42,
        numParticles: 35535,
        fadeOpacity: 0.996,
        sizeScale: 1.2,
        rampColors: {
          0.0: '#3288bd',
          0.1: '#66c2a5',
          0.2: '#abdda4',
          0.3: '#e6f598',
          0.4: '#fee08b',
          0.5: '#fdae61',
          0.6: '#f46d43',
          1.0: '#d53e4f',
        },
      });

    // TODO: LLVM ERROR: out of memory
    // scene.addLayer(layer);
  });
});
