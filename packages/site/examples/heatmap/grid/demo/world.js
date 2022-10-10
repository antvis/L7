import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 110.097892, 33.853662 ],
    zoom: 4.056
  })
});
scene.on('loaded', () => {
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
        .shape('square')
        .style({
          coverage: 1,
          angle: 0
        })
        .color(
          'count',
          [
            '#FF3417',
            '#FF7412',
            '#FFB02A',
            '#FFE754',
            '#46F3FF',
            '#02BEFF',
            '#1A7AFF',
            '#0A1FB2'
          ].reverse()
        );
      scene.addLayer(layer);
    });
});
