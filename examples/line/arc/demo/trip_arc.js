import { Arc3DLineLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'mapbox',
  style: 'light',
  center: [-74.0334588, 40.7162469],
  zoom: 10,
});
window.mapScene = scene;
fetch('https://gw.alipayobjects.com/os/basement_prod/bd33a685-a17e-4686-bc79-b0e6a89fd950.csv')
  .then((res) => res.text())
  .then((data) => {
    const layer =
    new Arc3DLineLayer({})
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
    .shape('arc')
    .color('#8C1EB2')
    .style({
      opacity: 0.8,
      blur: 0.99
    })
    ;
   scene.addLayer(layer);
  })
