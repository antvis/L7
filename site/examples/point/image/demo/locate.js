import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [116.276227, 35.256776],
    zoom: 6,
  }),
});
scene.addImage(
  'marker',
  'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*BJ6cTpDcuLcAAAAAAAAAAABkARQnAQ',
);
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/e2fc6e0a-af2a-4320-96e5-d9f5a5fda442.json')
    .then((res) => res.json())
    .then((data) => {
      const imageLayer = new PointLayer().source(data).shape('marker').size(12);
      scene.addLayer(imageLayer);
    });
});
