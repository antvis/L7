import { PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: { map: string; renderer: string }) {
  const scene = new Scene({
    id: 'map',
    renderer: option.renderer === 'device' ? 'device' : 'regl',
    map: new allMap[option.map || 'Map']({
      style: 'light',
      center: [121.434765, 31.256735],
      zoom: 14.83,
    }),
  });
  scene.on('loaded', () => {
    fetch(
      'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
    )
      .then((res) => res.json())
      .then((data) => {
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
          .size(25)
          .style({
            textOffset: [0, 20],
          });
        scene.addLayer(imageLayerText);

        if (window['screenshot']) {
          window['screenshot']();
        }
      });
  });
}
