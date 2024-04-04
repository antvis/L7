import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.400257, 31.25287],
      zoom: 14.55,
      rotation: 134.9507,
    }),
  });

  fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
    .then((res) => res.json())
    .then((data) => {
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
    });
}
