import { HeatMapGridLayer, HeatMapGrid3dLayer } from '@l7/layers';
import { Scene } from '@l7/scene';
const scene = new Scene({
  id: 'map',
  style: 'light',
  pitch: 47.49999999999995,
  center: [114.05737552216226, 22.542656745583486],
  zoom: 3,
  type: 'mapbox',
});
window.mapScene = scene;
fetch(
  'https://gw.alipayobjects.com/os/basement_prod/7359a5e9-3c5e-453f-b207-bc892fb23b84.csv',
)
  .then((res) => res.text())
  .then((data) => {
    const layer = new HeatMapGrid3dLayer({})
      .source(data, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat'
      },
      transforms:[
        {
        type: 'hexagon',
        size: 10000,
        field:'v',
        method:'sum'
      }
      ]
    })
    .size('sum',(value)=>{
       return value * 10;
    })
    .shape('square')
     .color('count', ["#002466","#105CB3","#2894E0","#CFF6FF","#FFF5B8","#FFAB5C","#F27049","#730D1C"])
    .style({
      coverage: 0.8,
      angle: 0,
    })
   
    scene.addLayer(layer);
  });
