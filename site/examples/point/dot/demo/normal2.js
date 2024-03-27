import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 64.88,
    style: 'dark',
    center: [114.060288, 22.53684],
    zoom: 15.63,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data)
        .size(2)
        .color('h8', [
          '#0A3663',
          '#1558AC',
          '#3771D9',
          '#4D89E5',
          '#64A5D3',
          '#72BED6',
          '#83CED6',
          '#A6E1E0',
          '#B8EFE2',
          '#D7F9F0',
        ]);

      scene.addLayer(pointLayer);
    });
});
