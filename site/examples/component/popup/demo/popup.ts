import { GaodeMap, Popup, Scene } from '@antv/l7';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'normal',
    center: [120.154672, 30.241095],
    zoom: 12,
  }),
  logoVisible: false,
});
scene.on('loaded', () => {
  const popup = new Popup({
    title: '自定义标题',
    html: '<p>Popup 示例的自定义内容</p>',
    lngLat: {
      lng: 120.154672,
      lat: 30.241095,
    },
  });

  scene.addPopup(popup);
});
