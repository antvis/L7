import { Scene, PointLayer } from '@antv/l7';
import { AMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new AMap({
    center: [ 121.417463, 31.215175 ],
    pitch: 0,
    zoom: 11
  })
});

fetch('https://gw.alipayobjects.com/os/rmsportal/BElVQFEFvpAKzddxFZxJ.txt')
  .then(res => res.text())
  .then(data => {
    const pointLayer = new PointLayer({})
      .source(data, {
        parser: {
          type: 'csv',
          y: 'lat',
          x: 'lng'
        }
      })
      .size(0.5)
      .color('#080298')
      .style({
        opacity: 1
      });

    scene.addLayer(pointLayer);
  });
