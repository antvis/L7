import { Scene, LineLayer, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 103.83735604457024, 1.360253881403068 ],
    zoom: 9.4678190476727,
    pitch: 20,
    style: 'light'
  })
});
scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/ee07641d-5490-4768-9826-25862e8019e1.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'json',
            coordinates: 'path'
          }
        })
        .size('level', level => {
          return [ 0.8, level * 0.1 ];
        })
        .shape('line')
        .active(true)
        .color(
          'level',
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
            '#D7F9F0'
          ]
            .reverse()
            .slice(0, 8)
        );
      layer.on('mousemove', e => {
        const popup = new Popup({
          offsets: [ 0, 0 ],
          closeButton: false
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>车次: ${e.feature.number}</span>`);
        scene.addPopup(popup);
      });
      scene.addLayer(layer);
    });
});
