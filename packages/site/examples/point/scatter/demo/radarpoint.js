import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120, 30 ],
    zoom: 13
  })
});

const layer = new PointLayer()
  .source(
    [
      {
        lng: 120,
        lat: 30
      }
    ],
    {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat'
      }
    }
  )
  .shape('radar')
  .size(100)
  .color('#d00')
  .style({
    speed: 5
  })
  .animate(true);

scene.on('loaded', () => {
  scene.addLayer(layer);
});
