import { HeatmapLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 47.49999999999995,
    center: [112.50447776627743, 30.830476390931125],
    zoom: 3.9879693680088626,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv')
    .then((res) => res.text())
    .then((data) => {
      const layer = new HeatmapLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'lng',
            y: 'lat',
          },
          transforms: [
            {
              type: 'hexagon',
              size: 200000,
              field: 'v',
              method: 'sum',
            },
          ],
        })
        .size('sum', (value) => {
          return value * 20;
        })
        .shape('hexagonColumn')
        .color(
          'count',
          ['#FF4818', '#F7B74A', '#FFF598', '#FF40F3', '#9415FF', '#421EB2'].reverse(),
        )
        .style({
          coverage: 0.9,
          angle: 0,
        });

      scene.addLayer(layer);
    });
});
