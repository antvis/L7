import { Scene, PolygonLayer } from '@antv/l7';
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
    map: string
   renderer: 'regl' | 'device'
}) {

    const scene = new Scene({
        id: 'map',
      renderer: option.renderer,
        map: new allMap[option.map || 'Map']({
            style: 'light',
            center: [121.434765, 31.256735],
            zoom: 14.83
        })
    });


    const layer = new PolygonLayer({
        autoFit:true,
    })
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [104.4140625, 35.460669951495305],
                  [98.7890625, 24.206889622398023],
                  [111.796875, 27.371767300523047],
                  [104.4140625, 35.460669951495305],
                ],
              ],
            },
          },
        ],
      })
      .shape('ocean')
      .animate(true)
      .color('#f00')
      .style({
        watercolor: '#6D99A8',
      });

    scene.on('loaded', () => {
      scene.addLayer(layer);

      if (window['screenshot']) {
        window['screenshot']();
      }
    });
}
