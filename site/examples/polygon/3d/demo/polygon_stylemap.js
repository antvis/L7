import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 50,
    center: [118.8, 32.056],
    zoom: 8,
  }),
});
const colors = [
  '#87CEFA',
  '#00BFFF',

  '#7FFFAA',
  '#00FF7F',
  '#32CD32',

  '#F0E68C',
  '#FFD700',

  '#FF7F50',
  '#FF6347',
  '#FF0000',
];
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json')
    .then((res) => res.json())
    .then((data) => {
      const filllayer = new PolygonLayer({
        name: 'fill',
        zIndex: 3,
      })
        .source(data)
        .shape('extrude')
        .color('unit_price', colors)
        .size('unit_price')
        .style({
          opacity: {
            field: 'unit_price',
            value: [0, 1],
          },
        })
        .active(true);
      scene.addLayer(filllayer);
    });
});
