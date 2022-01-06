// Data Source https://busrouter.sg/visualization/

import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 121.472644, 31.231706 ],
    zoom: 8.15,
    pitch: 0,
    style: 'dark'
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/0290a972-eedd-42f6-b69e-50a35e8a0824.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'coordinates'
          }
        })
        .size(0.5)
        .shape('line')
        .active(true)
        .color('length', [
          '#0A3663',
          '#1558AC',
          '#3771D9',
          '#4D89E5',
          '#64A5D3',
          '#72BED6',
          '#83CED6',
          '#A6E1E0',
          '#B8EFE2',
          '#D7F9F0'
        ]);
      scene.addLayer(layer);
    });
});
