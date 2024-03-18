import { Scene, GaodeMap, MouseLocation } from '@antv/l7';

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
  const mouseLocation = new MouseLocation({
    position: 'bottomright',
  });
  scene.addControl(mouseLocation);
});
