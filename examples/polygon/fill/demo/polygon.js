import { Scene, PolygonLayer, LineLayer } from '@antv/l7';
import { AMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new AMap({
    pitch: 0,
    style: 'light',
    center: [ 107.042225, 37.66565 ],
    zoom: 3.87
  })
});

fetch('https://gw.alipayobjects.com/os/rmsportal/JToMOWvicvJOISZFCkEI.json')
  .then(res => res.json())
  .then(data => {
    const colors = [
      '#D7F9F0',
      '#A6E1E0',
      '#72BED6',
      '#5B8FF9',
      '#3474DB',
      '#005CBE',
      '#00419F',
      '#00287E'
    ];
    const layer = new PolygonLayer({})
      .source(data)
      .color('name', colors)
      .shape('fill')
      .style({
        opacity: 0.9
      });

    const layer2 = new LineLayer({
      zIndex: 2
    })
      .source(data)
      .color('#fff')
      .size(0.3)
      .style({
        opacity: 1
      });

    scene.addLayer(layer);
    scene.addLayer(layer2);
  });
