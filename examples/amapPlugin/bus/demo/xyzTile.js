import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 105, 30 ],
    pitch: 0,
    zoom: 2
  })
});

scene.on('loaded', () => {
  const xyzTileLayer = new window.AMap.TileLayer({
    getTileUrl:
        'https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11',
    zIndex: 100
  });
  scene.getMapService().map.add(xyzTileLayer);
});
