import { Arc3DLineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  pitch: 40,
  type: 'amap',
  style: 'dark',
  center: [102.602992, 23.107329],
  zoom: 3,
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
    .color('#1558AC')
    .style({
      opacity: 0.8,
    })
    ;
   scene.addLayer(layer);
  })
