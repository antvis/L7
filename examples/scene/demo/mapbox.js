import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [ -97.119140625, 38.75408327579141],
  zoom: 2,
});
scene.render();

