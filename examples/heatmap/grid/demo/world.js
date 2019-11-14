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
            size: 200000,
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
      .color('sum', [
            '#2E8AE6',
            '#69D1AB',
            '#DAF291',
            '#FFD591',
            '#FF7A45',
            '#CF1D49',
      ]);
    scene.addLayer(layer);


  });
