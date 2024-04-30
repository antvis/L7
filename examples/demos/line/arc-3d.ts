import { LineLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'dark',
      center: [104.34278, 41.12554],
      zoom: 2.94888,
      pitch: 0,
    }),
  });

  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/bmw-prod/e495c407-953b-44cc-8f77-87b9cf257578.json')
      .then((res) => res.json())
      .then((data) => {
        const layer = new LineLayer({})
          .source(data, {
            parser: {
              type: 'json',
              x: 'from_lon',
              y: 'from_lat',
              x1: 'to_lon',
              y1: 'to_lat',
            },
          })
          .size(2)
          .shape('arc3d')
          .color('#FF7C6A')
          .style({
            segmentNumber: 15,
            opacity: 0.8,
          });
        scene.addLayer(layer);
        if (window['screenshot']) {
          window['screenshot']();
        }
      });
  });
}
