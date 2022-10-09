import { Scene, GaodeMapV2, Logo } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMapV2({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
  }),
  logoVisible: false,
});
scene.on('loaded', () => {
  const logo = new Logo();
  scene.addControl(logo);
});
