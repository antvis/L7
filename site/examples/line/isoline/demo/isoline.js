import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [104.117492, 36.492696],
    zoom: 3.89,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/9f6afbcd-3aec-4a26-bd4a-2276d3439e0d.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({})
        .source(data)
        .scale('value', {
          type: 'quantile',
        })
        .size('value', [0.5, 1, 1.5, 2])
        .shape('line')
        .color(
          'value',
          [
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
          ].reverse(),
        );
      scene.addLayer(layer);
    });
});
