import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [ 90.268, 40.3628 ],
    zoom: 3
  })
});

scene.on('loaded', () => {
  // 影像底图服务
  const baseLayer = new RasterLayer({
    zIndex: 1
  });
  baseLayer.source(
    'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        // minZoom: 6,
        // maxZoom: 15,
        zoomOffset: 0
        // extent: [-180, -85.051129, 179, 85.051129],
      }
    }
  );

  // 影像注记服务
  const annotionLayer = new RasterLayer({
    zIndex: 2
  });
  annotionLayer.source(
    'https://webst0{1-3}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        // minZoom: 6,
        // maxZoom: 15,
        zoomOffset: 0
        // extent: [-180, -85.051129, 179, 85.051129],
      }
    }
  );

  scene.addLayer(baseLayer);
  scene.addLayer(annotionLayer);
});
