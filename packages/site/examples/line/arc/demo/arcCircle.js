import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 107.77791556935472, 35.443286920228644 ],
    zoom: 2.9142882493605033
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
    .then(res => res.text())
    .then(data => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'lng1',
            y: 'lat1',
            x1: 'lng2',
            y1: 'lat2'
          }
        })
        .size(1)
        .shape('greatcircle')
        .color('#8C1EB2')
        .style({
          opacity: 0.8
        });
      scene.addLayer(layer);
    });
});
