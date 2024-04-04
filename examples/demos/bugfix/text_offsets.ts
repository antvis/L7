import { PointLayer, Scene } from '@antv/l7';
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
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
      .then((res) => res.json())
      .then((data) => {
        const circleLayer = new PointLayer()
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
          })
          .shape('circle')
          .color('#0f0')
          .size(5);
        const imageLayerText = new PointLayer()
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
          })
          .shape('name', 'text')
          .color('#f00')
          .size(10)
          .style({
            textOffset: {
              field: 'count',
              value: (v) => {
                return [0, v * 14];
              },
            },
          });
        scene.addLayer(imageLayerText);
        scene.addLayer(circleLayer);

        if (window['screenshot']) {
          window['screenshot']();
        }
      });
  });
}
