import { Scale, Zoom, Scene } from '@antv/l7';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'light',
  center: [-97.119140625, 38.75408327579141],
  zoom: 2,
});

const zoomControl = new Zoom();
const scaleControl = new Scale({
  position:'rightbottom',
});
scene.addControl(zoomControl);
scene.addControl(scaleControl);


