import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [ 104.995156, 31.450658 ],
    zoom: 3.79
  })
});
scene.on('loaded', () => {
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
        .shape('hexagon')
        .style({
          coverage: 0.9,
          angle: 0,
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
});
