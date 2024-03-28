import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [121.417463, 31.215175],
    zoom: 11,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/BElVQFEFvpAKzddxFZxJ.txt')
    .then((res) => res.text())
    .then((data) => {
      const pointLayer = new PointLayer({
        blend: 'additive',
      })
        .source(data, {
          parser: {
            type: 'csv',
            y: 'lat',
            x: 'lng',
          },
        })
        .size(0.5)
        .color('#080298');

      scene.addLayer(pointLayer);
    });
});
