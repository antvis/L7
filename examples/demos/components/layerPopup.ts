import { LayerPopup, PointLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

export function MapRender(options: RenderDemoOptions) {
  const scene = new Scene({
    id: 'map',
    renderer: options.renderer,
    map: new allMap.GaodeMap({
      style: 'light',
      center: [121.435159, 31.256971],
      zoom: 14.89,
      minZoom: 10,
    }),
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({
          name: 'layer',
        })
          .source(data, {
            parser: {
              type: 'json',
              x: 'longitude',
              y: 'latitude',
            },
          })
          .shape('name', [
            'circle',
            'triangle',
            'square',
            'pentagon',
            'hexagon',
            'octogon',
            'hexagram',
            'rhombus',
            'vesica',
          ])
          .size('unit_price', [10, 25])
          .color('name', ['#5B8FF9', '#5CCEA1', '#5D7092', '#F6BD16', '#E86452'])
          .style({
            opacity: 1,
            strokeWidth: 2,
          });

        scene.addLayer(pointLayer);

        const layerPopup = new LayerPopup({
          items: [
            {
              layer: 'layer',
              fields: ['name', 'count'],
            },
          ],
        });

        scene.addPopup(layerPopup);
      });
  });
}
