import { Scene } from '@antv/l7';
import { DrawEvent, DrawPolygon } from '@antv/l7-draw';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [120.211944, 30.288946],
    zoom: 7.05,
  }),
});
scene.on('loaded', () => {
  const drawPolygon = new DrawPolygon(scene, {
    areaOptions: {},
  });
  drawPolygon.enable();

  drawPolygon.on(DrawEvent.Change, (allFeatures) => {
    console.log(allFeatures);
  });
});
