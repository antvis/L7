// @ts-ignore
import { Scene, PointLayer } from '@antv/l7';
// @ts-ignore
import { GaodeMapV2 } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new GaodeMapV2({
    center: [112, 30],
    zoom: 3,
    style:'normal'
  }),
});

const layer = new PointLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
});
layer
  .source(
    'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
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
  .shape('circle')
  .color('COLOR')
  .size(10);
// .select(true);

scene.on('loaded', () => {
  scene.addLayer(layer);
});
