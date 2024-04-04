import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });

  const layer = new PolygonLayer({
    autoFit: true,
  })
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [104.4140625, 35.460669951495305],
                [114.4140625, 35.460669951495305],
                [114.4140625, 30.460669951495305],
                [104.4140625, 30.460669951495305],
                [104.4140625, 35.460669951495305],
              ],
            ],
          },
        },
      ],
    })
    .shape('water')
    .color('#1E90FF')
    .style({
      speed: 0.4,
      waterTexture:
        'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*EojwT4VzSiYAAAAAAAAAAAAAARQnAQ',
    })
    .animate(true);

  scene.on('loaded', () => {
    scene.addLayer(layer);

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
