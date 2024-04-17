import { LineLayer, Scene, Source } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'normal',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });
  const geoData = {
    type: 'FeatureCollection',
    features: [
      {
        type: 'Feature',
        properties: {},
        geometry: {
          type: 'LineString',
          coordinates: [
            [120.104021, 30.262493],
            [120.103875, 30.262601],
            [120.103963, 30.262694],
          ],
        },
      },
    ],
  };

  const source = new Source(geoData);
  const layer = new LineLayer({ blend: 'normal', autoFit: true })
    .source(source)
    .size(2)
    .shape('line')
    .color('#f00')
    .style({
      opacity: 1,
    });

  scene.on('loaded', () => {
    scene.addLayer(layer);
  });
}
