import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 0,
    style: 'light',
    center: [ 60, 40.7128 ],
    zoom: 2
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/7455fead-1dc0-458d-b91a-fb4cf99e701e.txt'
  )
    .then(res => res.text())
    .then(data => {
      const layer = new LineLayer({ blend: 'normal' })
        .source(data,
          {
            parser: {
              type: 'csv',
              x: 'lng1',
              y: 'lat1',
              x1: 'lng2',
              y1: 'lat2'
            }
          })
        .size(1)
        .shape('arc')
        .color('#6495ED')
        .animate({
          duration: 4,
          interval: 0.2,
          trailLength: 0.6
        });
      // .forward(false)
      scene.addLayer(layer);
    });
});
