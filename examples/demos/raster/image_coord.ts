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
    const layer = new ImageLayer({
      autoFit: true,
    });
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
    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
