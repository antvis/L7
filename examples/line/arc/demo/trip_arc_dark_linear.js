import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 57.999999999999964,
    style: 'dark',
    center: [ 101.94365594271085, 40.46139674355291 ],
    zoom: 2.7484264183323437,
    rotation: -21.600099999999884
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
        .shape('arc3d')
        .color('#FF7C6A')
        .style({
          opacity: 0.8,
          sourceColor: '#f00',
          targetColor: '#6F19FF'
        });
      scene.addLayer(layer);
    });
});
