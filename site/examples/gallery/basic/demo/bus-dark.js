import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [103.83735604457024, 1.360253881403068],
    pitch: 4.00000000000001,
    zoom: 10.210275860702593,
    rotation: 19.313180925794313,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/ee07641d-5490-4768-9826-25862e8019e1.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            coordinates: 'path',
            type: 'json',
          },
        })
        .size('level', (level) => {
          return [1.0, level * 1];
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
            '#FFF3FC',
          ].slice(0, 8),
        );
      scene.addLayer(layer);
    });
});
