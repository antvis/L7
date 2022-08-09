import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 60,
    type: 'mapbox',
    style: 'light',
    center: [ -74.05371169148452, 40.72573640479783 ],
    zoom: 12.45977,
    rotation: -38.39999999999969
  })
});

scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/bd33a685-a17e-4686-bc79-b0e6a89fd950.csv'
  )
    .then(res => res.text())
    .then(data => {
      const layer = new LineLayer({
        blend: 'normal'
      })
        .source(data, {
          parser: {
            type: 'csv',
            x: 'start station longitude',
            y: 'start station latitude',
            x1: 'end station longitude',
            y1: 'end station latitude'
          }
        })
        .size(2)
        .shape('arc3d')
        .color('#0C47BF')
        .animate({
          interval: 0.5,
          trailLength: 0.5,
          duration: 5
        })
        .style({
          opacity: 0.5
        });
      scene.addLayer(layer);
    });
});
