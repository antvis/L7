import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [120, 30],
      zoom: 13,
    }),
  });

  const layer = new PointLayer()
    .source([{ lng: 120, lat: 30 }], {
      parser: { type: 'json', x: 'lng', y: 'lat' },
    })
    .shape('radar')
    .size(100)
    .color('#d00')
    .style({
      speed: 5,
    })
    .animate(true);

  scene.on('loaded', () => {
    scene.addLayer(layer);
  });
}
