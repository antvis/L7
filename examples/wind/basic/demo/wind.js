import { Scene, WindLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 90, 32.24997445586331 ],
    style: 'dark',
    zoom: 2
  })
});

scene.on('loaded', () => {
  const layer = new WindLayer({});
  layer
    .source(
      'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*wcU8S5xMEDYAAAAAAAAAAAAAARQnAQ',
      {
        parser: {
          type: 'image',
          extent: [ -180, -85, 180, 85 ]
        }
      }
    )
    .animate(true)
    .style({
      uMin: -21.32,
      uMax: 26.8,
      vMin: -21.57,
      vMax: 21.42,
      numParticles: 35535,
      fadeOpacity: 0.996,
      sizeScale: 1.2,
      rampColors: {
        0.0: '#3288bd',
        0.1: '#66c2a5',
        0.2: '#abdda4',
        0.3: '#e6f598',
        0.4: '#fee08b',
        0.5: '#fdae61',
        0.6: '#f46d43',
        1.0: '#d53e4f'
      }
    });
  scene.addLayer(layer);
});
