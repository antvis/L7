import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 116.3956, 39.9392 ],
    pitch: 20,
    zoom: 10,
    style: 'dark'
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/0d2f0113-f48b-4db9-8adc-a3937243d5a3.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data)
        .size(4)
        .shape('line')
        .color('标准名称', [ '#5B8FF9', '#5CCEA1', '#F6BD16' ])
        .style({
          borderWidth: 0.4,
          borderColor: '#fff'
        });
      scene.addLayer(layer);
    });
});

