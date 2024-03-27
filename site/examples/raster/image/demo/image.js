import { ImageLayer, RasterLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    style: 'light',
    center: [121.268, 30.3628],
    zoom: 10,
  }),
});
scene.on('loaded', () => {
  const baseLayer = new RasterLayer({
    zIndex: 0,
  });
  baseLayer.source('https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
    },
  });
  const layer = new ImageLayer({});
  layer.source('https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg', {
    parser: {
      type: 'image',
      extent: [121.168, 30.2828, 121.384, 30.4219],
    },
  });
  scene.addLayer(baseLayer);
  scene.addLayer(layer);
});
