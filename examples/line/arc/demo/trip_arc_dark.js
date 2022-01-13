import { Scene, LineLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    pitch: 60,
    style: 'dark',
    center: [ 104.34278, 41.12554 ],
    zoom: 2.94888,
    rotation: 42.3999
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/e495c407-953b-44cc-8f77-87b9cf257578.json')
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'from_lon',
            y: 'from_lat',
            x1: 'to_lon',
            y1: 'to_lat'
          }
        })
        .size(1)
        .shape('arc')
        .color('#FF7C6A')
        .style({
          segmentNumber: 15,
          opacity: 0.8
        });
      scene.addLayer(layer);
    });
});
