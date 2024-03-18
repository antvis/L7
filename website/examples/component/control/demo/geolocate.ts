import { Scene, GaodeMap, GeoLocate } from '@antv/l7';
import gcoord from 'gcoord';

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
  const geoLocate = new GeoLocate({
    transform: (position) => {
      // 将获取到基于 WGS84 地理坐标系 的坐标转成 GCJ02 坐标系
      return gcoord.transform(position, gcoord.WGS84, gcoord.GCJ02);
    },
  });
  scene.addControl(geoLocate);
});
