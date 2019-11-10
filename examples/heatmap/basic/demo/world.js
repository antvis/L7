import { Scene } from '@l7/scene';
import { HeatMapGridLayer } from '@l7/layers';
const scene = new Scene({
  id: 'map',
  style: 'light',
  pitch: 0,
  center: [116.49434030056, 39.868073421167621],
  type: 'amap',
  zoom: 3,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new HeatMapGridLayer({
      })
      .source(data, {
        transforms: [
          {
            type: 'grid',
            size: 100000,
            field: 'capacity',
            method: 'sum',
          },
        ],
      })
      .size('sum', (value) => {
        return value;
      })
      .scale('sum',{
        type:'quantile',
      })
      .shape('square')
      .style({
        coverage: 1,
        angle: 0,
        opacity: 1.0,
      })
      .color('sum', [
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


  });
