import { LineLayer } from '@antv/l7-layers';
import { Scene } from '@antv/l7-scene';
const scene = new Scene({
  id: 'map',
  pitch: 60,
  type: 'mapbox',
  style: 'dark',
  center: [104.92827320100344,41.209090496438364],
  zoom: 2.8844827033002813,
 rotation: 80,
});


fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
  .then((res) => res.text())
  .then((data) => {
    const layer =
    new LineLayer({})
    .source(data, {
      parser: {
        type: 'csv',
        x: 'lng1',
        y: 'lat1',
        x1: 'lng2',
        y1: 'lat2',
      },
    })
    .size(1)
    .shape('arc3d')
    .color('#FF7C6A')
    .style({
      opacity: 0.8,
    })
    scene.addLayer(layer);
  });
