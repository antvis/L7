import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 60,
    style: 'light',
    center: [-74.06967, 40.720399],
    zoom: 12.45977,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/bd33a685-a17e-4686-bc79-b0e6a89fd950.csv')
    .then((res) => res.text())
    .then((data) => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'start station longitude',
            y: 'start station latitude',
            x1: 'end station longitude',
            y1: 'end station latitude',
          },
        })
        .size(1)
        .shape('arc3d')
        .color('#0C47BF')
        .style({
          blur: 0.9,
        });
      scene.addLayer(layer);
    });
});
