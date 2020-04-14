// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'light',
    layers: [],
    center: [ 116.1608, 40.1119 ],
    zoom: 15
  })
});
scene.on('loaded', () => {
  const layer1 = new AMap.TileLayer.Satellite();
  scene.map.setLayers([]);
  layer1.setMap(scene.map);
  const drawControl = new DrawControl(scene, {
    position: 'topright',
    layout: 'horizontal', // horizontal vertical
    controls: {
      point: true,
      polygon: true,
      line: true,
      circle: true,
      rect: true,
      delete: true
    }
  });
  scene.addControl(drawControl);

});
