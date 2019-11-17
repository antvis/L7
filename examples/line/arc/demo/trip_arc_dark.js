import { Arc3DLineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
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
    new Arc3DLineLayer({})
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
    .shape('arc')
    .color('#FF7C6A')
    .style({
      opacity: 0.8,
    })
  });
