import { PointLayer, Popup, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 70,
    style: 'dark',
    center: [105, 31.847],
    rotation: 0,
    zoom: 4.2,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({ depth: false })
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w',
          },
        })
        .shape('cylinder')
        .size('t', function (level) {
          return [1, 1, level * 2 + 20];
        })
        .animate(true)
        .active(true)
        .color('#006CFF')
        .style({
          opacity: 0.8,
          sourceColor: 'red',
          targetColor: 'yellow',
          lightEnable: false,
        });
      pointLayer.on('mousemove', (e) => {
        const popup = new Popup({
          offsets: [0, 0],
          closeButton: false,
        })
          .setLnglat(e.lngLat)
          .setHTML(`<span>${e.feature.s}: ${e.feature.t}℃</span>`);
        scene.addPopup(popup);
      });
      scene.addLayer(pointLayer);
    });
});
