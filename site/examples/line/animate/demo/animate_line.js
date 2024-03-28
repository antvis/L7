import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [-74.006, 40.7128],
    zoom: 14,
    style: 'dark',
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/5592c737-1c70-4d6b-82c1-e74e5a019b04.json')
    .then((res) => res.json())
    .then((data) => {
      const lineLayer = new LineLayer()
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'path',
          },
        })
        .size(1.5)
        .shape('line')
        .color('color', (v) => {
          return `rgb(${v})`;
        })
        .animate({
          interval: 0.6,
          trailLength: 1.5,
          duration: 6,
        });
      scene.addLayer(lineLayer);
    });
});
