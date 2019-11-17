import { HeatMapGridLayer, HeatMapGrid3dLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  style: 'dark',
  pitch: 46.49999999999997,
  center: [112.10377141242463, 29.968602656853605],
  zoom: 3.856,
  type: 'amap',
});
window.mapScene = scene;
fetch(
  'https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv',
)
  .then((res) => res.text())
  .then((data) => {
    const layer = new HeatMapGridLayer({})
      .source(data, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat'
      },
      transforms:[
        {
        type: 'grid',
        size: 10000,
        field:'v',
        method:'sum'
       }
      ]
    })
    .size('count',(value)=>{
       return value * 0;
    })
    .shape('square')
    .style({
      coverage: 1,
      angle: 0,
    })
    .color('count', [
      '#FF4818', '#F7B74A',
      '#FFF598', '#FF40F3',
      '#9415FF', '#421EB2'
    ].reverse())
    scene.addLayer(layer);
  });
