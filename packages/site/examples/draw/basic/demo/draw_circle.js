import { Scene } from '@antv/l7';
import { DrawCircle } from '@antv/l7-draw';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'light',
    center: [ 113.775374, 28.31067 ],
    zoom: 12
  })
});
scene.on('loaded', () => {
  const drawCircle = new DrawCircle(scene);
  drawCircle.enable();
  drawCircle.on('draw.create', e => {
    console.log(e);
  });
  drawCircle.on('draw.update', e => {
    console.log('update', e);
  });
});
