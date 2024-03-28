import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    version: '2.1.0',
    center: [112, 23.69],
    zoom: 2.5,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/9078fd36-ce8d-4ee2-91bc-605db8315fdf.csv')
    .then((res) => res.text())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'Longitude',
            y: 'Latitude',
          },
        })
        .shape('circle')
        .active(true)
        .animate(true)
        .size(56)
        .color('#4cfd47');

      scene.addLayer(pointLayer);
    });
});
