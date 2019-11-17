import { Scene } from '@l7/scene';
import { HeatMapGridLayer, HeatMapGrid3dLayer } from '@l7/layers';
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
      new HeatMapGrid3dLayer({
      })
      .source(data, {
        transforms: [
          {
            type: 'hexagon',
            size: 90000,
            field: 'capacity',
            method: 'sum',
          },
        ],
      })
      .size('sum', (value) => {
        return value * 50;
      })
      .shape('hexagon')
      .style({
        coverage: 0.9,
        angle: 0,
        opacity: 1.0,
      })
      .color('sum',  [
        '#1D2BB2', '#06117C',
        '#06117C', '#06117C',
        '#1D2BB2', '#1D2BB2',
        '#1D2BB2', '#0F62FF',
        '#0F62FF', '#0CB7FF',
        '#0CB7FF', '#52F1FC'

      ].reverse());
    scene.addLayer(layer);


  });
