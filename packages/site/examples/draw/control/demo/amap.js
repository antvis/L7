// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { ControlEvent, DrawControl } from '@antv/l7-draw';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [116.1608, 40.1119],
    zoom: 15,
  }),
});
scene.on('loaded', () => {
  const tileLayer = new AMap.TileLayer.Satellite();
  tileLayer.setMap(scene.map);

  const drawControl = new DrawControl(scene, {});
  scene.addControl(drawControl);
  drawControl.on(ControlEvent.DrawChange, (changeType) => {
    console.log(changeType);
  });
});
