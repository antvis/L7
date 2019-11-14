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
            size: 20,
            field: 'count',
            method: 'sum',
          },
        ],
      })
      .size('sum', (value) => {
        return value;
      })
      .shape('circle')
      .style({
        coverage: 0.8,
        angle: 0,
        opacity: 1.0,
      })
      .color('count',  ['#0A3663', '#1558AC',
      '#3771D9', '#4D89E5',
      '#64A5D3', '#72BED6',
      '#83CED6', '#A6E1E0',
      '#B8EFE2', '#D7F9F0']);
    scene.addLayer(layer);
    console.log(layer);


  });
