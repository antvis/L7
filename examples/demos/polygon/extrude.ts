import { PolygonLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import data from '../../data/nanjing-city.json';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
      pitch: 45,
    }),
  });
  scene.on('loaded', () => {
    const filllayer = new PolygonLayer({
      name: 'fill',
      zIndex: 3,
      autoFit: true,
    })
      .source(data)
      .shape('extrude')
      .active(true)
      .size('unit_price', (unit_price) => unit_price)
      .color('count', ['#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f'])
      .style({
        pickLight: true,
        opacity: 1,
      });
    scene.addLayer(filllayer);

    if (window['screenshot']) {
      window['screenshot']();
    }
  });
}
