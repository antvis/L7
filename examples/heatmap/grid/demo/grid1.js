import { Scene, HeatmapLayer } from '@antv/l7';
import { AMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new AMap({
    style: 'dark',
    pitch: 0,
    center: [ 110.097892, 33.853662 ],
    zoom: 4.056
  })
});

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv'
)
  .then(res => res.text())
  .then(data => {
    const layer = new HeatmapLayer({})
      .source(data, {
        parser: {
          type: 'csv',
          x: 'lng',
          y: 'lat'
        },
        transforms: [
          {
            type: 'grid',
            size: 10000,
            field: 'v',
            method: 'sum'
          }
        ]
      })
      .size('count', value => {
        return value * 0;
      })
      .shape('square')
      .style({
        coverage: 1,
        angle: 0
      })
      .color(
        'count',
        [
          '#FF4818',
          '#F7B74A',
          '#FFF598',
          '#FF40F3',
          '#9415FF',
          '#421EB2'
        ].reverse()
      );
    scene.addLayer(layer);
  });
