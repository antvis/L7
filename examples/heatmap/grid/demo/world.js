import { HeatMapGridLayer, HeatMapGrid3dLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  style: 'dark',
  pitch: 0,
  center: [110.097892,  33.853662],
  zoom: 4.056,
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
      '#FF3417', '#FF7412',
      '#FFB02A', '#FFE754',
      '#46F3FF', '#02BEFF',
      '#1A7AFF', '#0A1FB2'
    ].reverse())
    scene.addLayer(layer);
  });
