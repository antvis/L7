import { ImageLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [115.5268, 34.3628],
      zoom: 7,
    }),
  });
  scene.on('loaded', () => {
    const layer = new ImageLayer({});
    layer.source(
      'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*8SUaRr7bxNsAAAAAAAAAAABkARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [113.1277263548, 32.3464238863, 118.1365790452, 36.4786759137],
        },
      },
    );
    scene.addLayer(layer);
    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
