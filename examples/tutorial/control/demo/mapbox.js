import { Scale, Zoom, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'light',
    pitch: 0,
    center: [ 107.054293, 35.246265 ],
    zoom: 4.056
  })
});
scene.on('loaded', () => {
  const zoomControl = new Zoom();
  const scaleControl = new Scale();
  scene.addControl(zoomControl);
  scene.addControl(scaleControl);
});
