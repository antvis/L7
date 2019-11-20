import { Scene } from '@l7/scene';
import { PolygonLayer, LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [116.3237, 39.8829],
  zoom: 9
});
window.mapScene = scene;
fetch('https://gw.alipayobjects.com/os/basement_prod/1d27c363-af3a-469e-ab5b-7a7e1ce4f311.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new PolygonLayer({
      })
      .source(data)
       .color('unit_price', [
    '#1A4397', '#2555B7',
    '#3165D1', '#467BE8',
    '#6296FE', '#7EA6F9',
    '#98B7F7', '#BDD0F8',
    '#DDE6F7', '#F2F5FC'
    ].reverse())
       .shape('fill')
       .style({
        opacity: 1
      })
    const layer2 =
      new LineLayer({
        zIndex: 2
      })
      .source(data)
       .color('#fff')
       .size(0.3)
       .style({
        opacity: 1
      })
   
    scene.addLayer(layer);
    scene.addLayer(layer2);
    console.log(layer);
  });
