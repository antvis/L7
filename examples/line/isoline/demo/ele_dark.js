import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 26.842105263157915,
    style: 'dark',
    center: [ 102.599436, 23.116371 ],
    zoom: 14.78
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data)
        .size('ELEV', h => {
          return [ h % 50 === 0 ? 1.0 : 0.5, (h - 1300) * 20 ];
        })
        .shape('line')
        .scale('ELEV', {
          type: 'quantize'
        })
        .color('ELEV', [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6'
        ]);
      scene.addLayer(layer);
    });
});
