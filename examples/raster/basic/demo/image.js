import { Scene } from '@antv/l7-scene';
import { ImageLayer } from '@antv/l7-layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [ 121.268, 30.3628 ],
  zoom: 13
});

const layer = new ImageLayer({});
layer.source(
  'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
  {
    parser: {
      type: 'image',
      extent: [ 121.168, 30.2828, 121.384, 30.4219 ]
    }
  }
);
scene.on('loaded', () => {
  scene.addLayer(layer);
});
