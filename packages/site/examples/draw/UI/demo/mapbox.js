// https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tif
import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 0,
    style: 'mapbox://styles/mapbox/satellite-v9',
    center: [ 115.5268, 34.3628 ],
    zoom: 15
  })
});
scene.on('loaded', () => {
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
