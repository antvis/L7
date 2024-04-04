import { PolygonLayer, RasterLayer, Scene } from '@antv/l7';
import * as allMap from '@antv/l7-maps';
import type { RenderDemoOptions } from '../../types';

const colorList = [
  '#419bdf', // Water

  '#358221', // Tree

  '#88b053', // Grass

  '#7a87c6', // vegetation

  '#e49635', // Crops

  '#dfc35a', // shrub

  '#ED022A', // Built Area

  '#EDE9E4', // Bare ground

  '#F2FAFF', // Snow

  '#C8C8C8', // Clouds
];
const positions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

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
    fetch('https://gw.alipayobjects.com/os/bmw-prod/fccd80c0-2611-49f9-9a9f-e2a4dd12226f.json')
      .then((res) => res.json())
      .then((maskData) => {
        const maskPolygon = new PolygonLayer({
          visible: false, // 隐藏maskPolygon
          autoFit: true,
        })
          .source(maskData)
          .shape('fill')
          .color('#f00')
          .style({
            opacity: 0.5,
          });
        const layer = new RasterLayer({
          maskLayers: [maskPolygon],
        })
          .source(
            'https://tiles{1-3}.geovisearth.com/base/v1/terrain_rgb/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
            {
              parser: {
                type: 'rasterTile',
                dataType: 'terrainRGB',
                tileSize: 256,
                zoomOffset: 0,
              },
            },
          )
          .style({
            clampLow: false,
            clampHigh: false,
            domain: [0, 7000],
            rampColors: {
              type: 'linear',
              colors: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
              positions: [0, 200, 500, 1000, 2000, 7000], // '#1a9850'
            },
          });

        scene.addLayer(layer);
        scene.addLayer(maskPolygon);
      });
  });
}
