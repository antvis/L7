// @ts-ignore
import {
  Scene,
  Source,
  RasterLayer,
  MaskLayer,
  LineLayer,
} from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  stencil: true,
  map: new Map({
    center: [-95.7548387434569, 44.82687715672517],
    zoom: 11,
  }),
});

// 卫星影像
const url1 =
  'https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.webp?sku=101ifSAcKcVFs&access_token=pk.eyJ1IjoidW5mb2xkZWRpbmMiLCJhIjoiY2s5ZG90MjMzMDV6eDNkbnh2cDJvbHl4NyJ9.BT2LAvHi31vNNEplsgxucQ';
const layer1 = new RasterLayer({
  zIndex: 1,
  mask: true,
}).source(url1, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
  },
});
const source = new Source(
  'https://cdn.unfolded.ai/indigo/hexify_v5/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 9,
    },
  },
);

const mask2 = new MaskLayer({
  sourceLayer: 'state_s10_27', // woods hillshade contour ecoregions ecoregions2 city
}).source(source);

const layer = new LineLayer({
  featureId: 'id',
  zIndex: 3,
  minZoom: 9,
  sourceLayer: 'state_s10_27', // woods hillshade contour ecoregions ecoregions2 city
})
  .source(source)
  .shape('simple')
  .color('#DFB02F')
  .size(0.3)
  .style({
    opacity: 1,
  });


scene.on('loaded', () => {
  scene.addLayer(mask2);
  scene.addLayer(layer1);
  scene.addLayer(layer);

})