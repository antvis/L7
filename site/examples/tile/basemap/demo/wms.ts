// @ts-ignore
import { RasterLayer, Scene } from '@antv/l7';
// @ts-ignore
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',

  map: new Map({
    center: [114.061677, 22.54899],
    zoom: 11,
  }),
});
const url1 =
  'https://tiles{1-3}.geovisearth.com/base/v1/img/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
const url2 =
  'https://tiles{1-3}.geovisearth.com/base/v1/cia/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
const layer1 = new RasterLayer({
  zIndex: 1,
}).source(url1, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
  },
});

const layer2 = new RasterLayer({
  zIndex: 1,
}).source(url2, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
  },
});
// WMS 底图 BBOX获取数据
const url =
  'https://pnr.sz.gov.cn/d-suplicmap/dynamap_1/rest/services/LAND_CERTAIN/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&layers=show:1&SIZE=256,256&BBOX={bbox}&BBOXSR=4326&IMAGESR=3857&DPI=90';

const layer = new RasterLayer({
  zIndex: 3,
}).source(url, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    zoomOffset: 0,
  },
});

scene.on('loaded', () => {
  scene.addLayer(layer1);
  scene.addLayer(layer2);
  scene.addLayer(layer);
});
