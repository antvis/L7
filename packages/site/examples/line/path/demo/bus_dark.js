// Data Source https://busrouter.sg/visualization/

import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 103.83735, 1.3602538 ],
    zoom: 9.4678190476727,
    pitch: 20,
    style: 'dark'
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/ee07641d-5490-4768-9826-25862e8019e1.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'path'
          }
        })
        .size('level', level => {
          return [ 0.8, level * 0.1 ];
        })
        .shape('line')
        .color(
          'level',
          [
            '#312B60',
            '#4A457E',
            '#615C99',
            '#816CAD',
            '#A67FB5',
            '#C997C7',
            '#DEB8D4',
            '#F5D4E6',
            '#FAE4F1',
            '#FFF3FC'
          ].slice(0, 8)
        );
      scene.addLayer(layer);
    });
});
