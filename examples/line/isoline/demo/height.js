// Data Source https://busrouter.sg/visualization/

import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 60,
    style: 'dark',
    center: [ 120.958472, 23.464292 ],
    zoom: 7.65,
    rotation: 33.375609237091055
  })
});

scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/65589ef3-7f1d-440f-ba5d-86b03ee6ba7e.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data)
        .size(1)
        .shape('line')
        .style({
          vertexHeightScale: 30
        })
        .color('#0D5EFF');

      scene.addLayer(layer);
    });
});
