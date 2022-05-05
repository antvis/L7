import { Scene, RasterTileLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [90.268, 40.3628],
    zoom: 3,
  }),
});

scene.on('loaded', () => {
  // 底图服务
  const baseLayer = new RasterTileLayer({
    zIndex: 1,
  });
  baseLayer.source(
    'https://t1.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=174705aebfe31b79b3587279e211cb9a',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        // minZoom: 6,
        // maxZoom: 15,
        zoomOffset: 0,
      },
    },
  );

  // 注记服务
  const annotionLayer = new RasterTileLayer({
    zIndex: 2,
  });
  annotionLayer.source(
    'https://t1.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=174705aebfe31b79b3587279e211cb9a',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        // minZoom: 6,
        // maxZoom: 15,
        zoomOffset: 0,
      },
    },
  );

  scene.addLayer(baseLayer);
  scene.addLayer(annotionLayer);
});
