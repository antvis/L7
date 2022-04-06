import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 53.6305,
    style: 'light',
    center: [ 102.600579, 23.114887 ],
    zoom: 13.5
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json')
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
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
        .color(
          'ELEV',
          [
            '#E4682F',
            '#FF8752',
            '#FFA783',
            '#FFBEA8',
            '#FFDCD6',
            '#EEF3FF',
            '#C8D7F5',
            '#A5C1FC',
            '#7FA7F9',
            '#5F8AE5'
          ].reverse()
        );
      scene.addLayer(layer);
    });
});
