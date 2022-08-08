import { Scene, PolygonLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 120, 29.732983 ],
    zoom: 6.2,
    pitch: 60
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/d434cac3-124e-4922-8eed-ccde01674cd3.json')
    .then(res => res.json())
    .then(data => {
      const provincelayer = new PolygonLayer({})
        .source(data)
        .size(150000)
        .shape('extrude')
        .color('#0DCCFF')
        .style({
          heightfixed: true,
          pickLight: true,
          raisingHeight: 200000,
          mapTexture:
          'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*0tmIRJG9cQQAAAAAAAAAAAAAARQnAQ',
          sourceColor: '#333',
          targetColor: '#fff'
        });

      scene.addLayer(provincelayer);
    });
});
