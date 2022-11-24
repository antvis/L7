//@ts-ignore
import { Scene, RasterLayer } from '@antv/l7';
//@ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [130, 30],
    pitch: 0,
    zoom: 1.5,
  }),
});
scene.on('loaded', () => {
  const layer = new RasterLayer()
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
        colors: ['#d73027', '#fc8d59', '#fee08b', '#d9ef8b', '#91cf60', '#1a9850'],
        positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      }
    });

  scene.addLayer(layer);
});

