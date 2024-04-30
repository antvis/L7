import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap[options.map]({
      style: 'light',
      center: [116.417463, 40.015175],
      zoom: 8,
      minZoom: 5,
    }),
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/antfincdn/8Ps2h%24qgmk/traffic_110000.csv')
      .then((res) => res.text())
      .then((data) => {
        const colors = ['#c57f34', '#cbfddf', '#edea70', '#8cc9f1', '#2c7bb6'];
        const pointLayer = new PointLayer({})
          .source(data, {
            parser: {
              type: 'csv',
              y: 'lat',
              x: 'lng',
            },
          })
          .shape('dot')
          .size(0.5)
          .color('type', (type) => {
            switch (parseInt(type)) {
              case 3:
                return colors[0];
              case 4:
                return colors[1];
              case 41:
                return colors[2];
              case 5:
                return colors[3];
              default:
                return colors[4];
            }
          });

        scene.addLayer(pointLayer);

        if (window['screenshot']) {
          window['screenshot']();
        }
      });
  });
}
