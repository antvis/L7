import { Scene, PointLayer } from '@antv/l7';
const scene = new Scene({
  id: 'map',
  type: 'amap',
  style: 'dark',
  center: [ 121.417463, 31.215175 ],
  pitch: 0,
  zoom: 11
});
window.mapScene = scene;
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
