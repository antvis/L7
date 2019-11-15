import { Arc2DLineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'dark',
  center: [102.602992, 23.107329],
  zoom: 2,
});

fetch('https://gw.alipayobjects.com/os/rmsportal/UEXQMifxtkQlYfChpPwT.txt')
  .then((res) => res.text())
  .then((data) => {
    const layer =
    new Arc2DLineLayer({})
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
    .color('#8C1EB2')
    .style({
      opacity: 0.8,
      blur: 0.99
    })
    ;
   scene.addLayer(layer);
  })
