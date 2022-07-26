import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 45.06995336442376,
    style: 'dark',
    center: [ 102.597971, 23.110479 ],
    zoom: 13.34,
    rotation: 360
  })
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({
        enableMultiPassRenderer: true,
        passes: [
          [
            'bloom',
            {
              bloomBaseRadio: 0.8,
              bloomRadius: 2,
              bloomIntensity: 1
            }
          ]
        ]
      })
        .source(data)
        .size('ELEV', h => {
          return [ h % 50 === 0 ? 1.0 : 0.5, (h - 1400) * 20 ];
        })
        .shape('line')
        .scale('ELEV', {
          type: 'quantize'
        })
        .style({
          heightfixed: true
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
