// @ts-ignore
import { PolygonLayer, RasterLayer, Scene, Source } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',

  map: new Map({
    center: [110, 30],
    // zoom: 12,
    zoom: 3,
  }),
});
const worldSource = new Source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

const fillLayer = new PolygonLayer({
  zIndex: 3,
  visible: false,
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(worldSource)
  .shape('fill')
  .color('COLOR')
  .style({
    opacity: 0.5,
  });

const layer = new RasterLayer({
  zIndex: 2,
  maskLayers: [fillLayer],
  enableMask: true,
})
  .source(
    'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
      },
    },
  )
  .style({
    opacity: 1,
  });

scene.on('loaded', () => {
  scene.addLayer(fillLayer);

  scene.addLayer(layer);
});
