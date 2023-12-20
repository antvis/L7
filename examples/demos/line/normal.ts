// @ts-ignore
import {
    LineLayer,
    Scene,
    Source,
    // @ts-ignore
  } from '@antv/l7';
  // @ts-ignore
import * as allMap from '@antv/l7-maps';

export function MapRender(option: {
    map: string
    device: string
}) {
    const scene = new Scene({
        id: 'map',
        renderer: option.device === 'device' ? 'device' : 'regl',
        map: new allMap[option.map || 'Map']({
            style: 'light',
            center: [121.434765, 31.256735],
            zoom: 14.83
        })
    });
    console.log(111)
    const geoData = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              offset: 0.3,
            },
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                [
                  [99.228515625, 37.43997405227057],
                  [100.72265625, 27.994401411046148],
                  [110, 27.994401411046148],
                  [110, 25],
                  [100, 25],
                ],
                [
                  [108.544921875, 37.71859032558816],
                  [112.412109375, 32.84267363195431],
                  [115, 32.84267363195431],
                  [115, 35],
                ],
              ],
            },
          },
          {
            type: 'Feature',
            properties: {
              offset: 0.8,
            },
            geometry: {
              type: 'MultiLineString',
              coordinates: [
                [
                  [110, 30],
                  [120, 30],
                  [120, 40],
                ],
              ],
            },
          },
        ],
      };
      const source = new Source(geoData);
      const layer = new LineLayer({ blend: 'normal',autoFit: true})
        .source(source)
        .size(10)
        .shape('line')
        .color('#f00')
        .style({
          opacity:0.6
        });
  
      scene.on('loaded', () => {
        scene.addLayer(layer);
      });

}
