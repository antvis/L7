import { Scene, PointLayer } from '@antv/l7';
import { AMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new AMap({
    pitch: 48.62562,
    style: 'light',
    center: [ 104.026043, 31.847 ],
    rotation: -0.76,
    zoom: 4.48
  }),
});

fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
  .then(res => res.json())
  .then(data => {
    const pointLayer = new PointLayer({})
      .source(data.list, {
        parser: {
          type: 'json',
          x: 'j',
          y: 'w'
        }
      })
      .shape('cylinder')
      .size('t', function(level) {
        return [ 1, 2, level * 2 + 20 ];
      })
      .color('#006CFF')
      .style({
        opacity: 1.0
      });
    scene.addLayer(pointLayer);
  });
