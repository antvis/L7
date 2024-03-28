// @ts-ignore
import { LineLayer, Scene } from '@antv/l7';
// @ts-ignore
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',

  map: new GaodeMap({
    style: 'light',
    center: [112, 30],
    zoom: 6,
  }),
});

const layer = new LineLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
});
layer
  .source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf', {
    parser: {
      type: 'mvt',
      tileSize: 256,
      zoomOffset: 0,
      maxZoom: 9,
    },
  })
  .shape('simple')
  .color('COLOR')
  .size(1)
  .select(true);
scene.on('loaded', () => {
  scene.addLayer(layer);
});
