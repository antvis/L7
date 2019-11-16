import { Scene } from '@l7/scene';
import { PolygonLayer, LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [102.430994, 29.877025],
  zoom: 3.52,
});

fetch('https://gw.alipayobjects.com/os/rmsportal/JToMOWvicvJOISZFCkEI.json')
  .then((res) => res.json())
  .then((data) => {
    var colors = ["#D7F9F0", "#A6E1E0", "#72BED6", "#5B8FF9", "#3474DB", "#005CBE",'#00419F','#00287E'];
    const layer =
      new PolygonLayer({
      })
      .source(data)
      .color('name', colors).shape('fill')
      .style({
        opacity: 0.9
      });

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
