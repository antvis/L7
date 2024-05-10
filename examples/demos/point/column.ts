import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import data from '../../data/shanghaixi-village.json';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.400257, 31.25287],
      zoom: 14.55,
      pitch: 45,
    }),
  });

  const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    })
    .shape('name', ['cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn'])
    .active(true)
    .size('unit_price', (h) => {
      return [6, 6, 100];
    })
    .color('name', ['#739DFF', '#61FCBF', '#FFDE74', '#FF896F'])
    .style({
      opacity: 1,
    });
  scene.addLayer(pointLayer);

  if (window['screenshot']) {
    window['screenshot']();
  }
}
