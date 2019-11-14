import { Scene } from '@l7/scene';
import { HeatMapGridLayer } from '@l7/layers';
const scene = new Scene({
  id: 'map',
  style: 'light',
  pitch: 0,
  center: [116.49434030056, 39.868073421167621],
  type: 'mapbox',
  zoom: 16,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/c3f8bda2-081b-449d-aa9f-9413b779205b.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new HeatMapGridLayer({
      })
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
        transforms: [
          {
            type: 'grid',
            size: 50,
            field: 'count',
            method: 'sum',
          },
        ],
      })
      .size('sum', (value) => {
        return value;
      })
      .shape('square')
      .style({
        coverage: 1.0,
        angle: 0,
        opacity: 1.0,
      })
      .color('count', [
        '#002466',
        '#105CB3',
        '#2894E0',
        '#CFF6FF',
        '#FFF5B8',
        '#FFAB5C',
        '#F27049',
        '#730D1C',
      ]);
    scene.addLayer(layer);
    console.log(layer);


  });
