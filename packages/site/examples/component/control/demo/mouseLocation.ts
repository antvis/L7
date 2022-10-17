import { Scene, GaodeMapV2, LayerControl, MouseLocation } from '@antv/l7';

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
  const mouseLocation = new MouseLocation({
    position: 'bottomright',
  });
  scene.addControl(mouseLocation);
});
