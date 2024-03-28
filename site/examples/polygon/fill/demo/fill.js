import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [116.368652, 39.93866],
    zoom: 10.07,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/1d27c363-af3a-469e-ab5b-7a7e1ce4f311.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new PolygonLayer({})
        .source(data)
        .color(
          'unit_price',
          [
            '#1A4397',
            '#2555B7',
            '#3165D1',
            '#467BE8',
            '#6296FE',
            '#7EA6F9',
            '#98B7F7',
            '#BDD0F8',
            '#DDE6F7',
            '#F2F5FC',
          ].reverse(),
        )
        .shape('fill')
        .active(true);
      const layer2 = new LineLayer({
        zIndex: 2,
      })
        .source(data)
        .color('#fff')
        .size(0.8);

      scene.addLayer(layer);
      scene.addLayer(layer2);
    });
});
