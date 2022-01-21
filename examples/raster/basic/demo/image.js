import { Scene, ImageLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'light',
    center: [ 121.268, 30.3628 ],
    zoom: 10
  })
});
scene.on('loaded', () => {
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
  scene.addLayer(layer);
});
