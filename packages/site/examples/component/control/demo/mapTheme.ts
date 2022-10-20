import { Scene, GaodeMapV2, MapTheme } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
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
