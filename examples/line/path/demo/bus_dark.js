import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 103.83735, 1.3602538 ],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
    style: 'dark',
  }),
});

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
        return [ 0.8, level * 1 ];
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
