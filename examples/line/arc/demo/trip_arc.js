import { LineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  pitch: 60,
  type: 'mapbox',
  style: 'light',
  center: [-74.06355155037261,40.73507179789368],
  zoom: 11.8623,
});
fetch('https://gw.alipayobjects.com/os/basement_prod/bd33a685-a17e-4686-bc79-b0e6a89fd950.csv')
  .then((res) => res.text())
  .then((data) => {
    const layer =
    new LineLayer({})
    .source(data, {
      parser: {
        type: 'csv',
        x: 'start station longitude',
        y: 'start station latitude',
        x1: 'end station longitude',
        y1: 'end station latitude',
      },
    })
    .size(1)
    .shape('arc3d')
    .color('#0C47BF')
    .style({
      opacity: 1,
      blur: 0.9
    })
    ;
   scene.addLayer(layer);
  })
