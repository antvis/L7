import { Scene, GeometryLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.1025, 30.2594 ],
    style: 'dark',
    zoom: 10
  })
});

scene.on('loaded', () => {
  const layer = new GeometryLayer()
    .shape('plane')
    .style({
      opacity: 0.8,
      width: 0.074,
      height: 0.061,
      center: [ 120.1025, 30.2594 ]
    })
    .active(true)
    .color('#ff0');
  scene.addLayer(layer);
});
