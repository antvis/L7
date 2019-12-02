import { Scene, Marker, Popup } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    style: 'light',
    pitch: 0,
    center: [121.4316962, 31.26082325],
    zoom: 12.056,
  }),
});
// 创建默认 marker
const popup = new Popup({
  offsets: [0, 20],
}).setText('hello');

const marker = new Marker()
  .setLnglat([121.4316962, 31.26082325])
  .setPopup(popup);

scene.addMarker(marker);
