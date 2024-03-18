// @ts-ignore
import { Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
 
  map: new Map({
    center: [112, 30],
    zoom: 3,
  }),
});

const layer = new PointLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
  blend: 'normal',
});
layer
  .source(
    'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
    {
      parser: {
        type: 'mvt',
        tileSize: 256,
        zoomOffset: 0,
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
      },
    },
  )
  .shape('COLOR', 'text')
  .color('COLOR')
  // .color('#000')
  .size(10)
  .select(true);

scene.on('loaded', () => {
  scene.addLayer(layer);
});
