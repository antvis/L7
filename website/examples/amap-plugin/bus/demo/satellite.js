import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 105, 30 ],
    zoom: 2
  })
});


scene.on('loaded', () => {
  scene.map.add(new window.AMap.TileLayer.Satellite());
});
