import { MapTheme, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-extension-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
  }),
});
scene.on('loaded', () => {
  const mapTheme = new MapTheme();
  scene.addControl(mapTheme);
});
