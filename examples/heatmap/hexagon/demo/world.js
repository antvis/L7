import { Scene, HeatmapLayer } from '@antv/l7';
const scene = new Scene({
  id: 'map',
  style: 'light',
  pitch: 0,
  center: [ 104.995156, 31.450658 ],
  type: 'amap',
  zoom: 3.79
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/337ddbb7-aa3f-4679-ab60-d64359241955.json'
)
  .then(res => res.json())
  .then(data => {
    const layer = new HeatmapLayer({})
      .source(data, {
        transforms: [
          {
            type: 'hexagon',
            size: 90000,
            field: 'capacity',
            method: 'sum'
          }
        ]
      })
      .size('sum', value => {
        return value * 50;
      })
      .shape('hexagon')
      .style({
        coverage: 0.9,
        angle: 0,
        opacity: 1.0
      })
      .color(
        'sum',
        [
          '#3F4BBA',
          '#3F4BBA',
          '#3F4BBA',
          '#3F4BBA',
          '#3C73DA',
          '#3C73DA',
          '#3C73DA',
          '#0F62FF',
          '#0F62FF',
          '#30B2E9',
          '#30B2E9',
          '#40C4CE'
        ].reverse()
      );
    scene.addLayer(layer);
  });
