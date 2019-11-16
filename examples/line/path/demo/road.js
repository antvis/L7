import { Scene } from '@l7/scene';
import { LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  center: [103.7850524, 1.4411409],
  pitch: 45,
  zoom: 10,
  rotation: 10,
  type: 'mapbox',
  style: 'light',
});

fetch('https://gw.alipayobjects.com/os/basement_prod/ee07641d-5490-4768-9826-25862e8019e1.json')
  .then((res) => res.json())
  .then((data) => {
    const layer =
      new LineLayer({
      })
        .source(data,{
          parser:{
            type:'json',
            coordinates:'path'
          }
        })
        .size('level',(level)=>{
          return [1.0 , level * 2]
        })
        .shape('line')
        .color(
          'level',
          ['#5B8FF9','#5CCEA1','#5D7092' ]
        )
    scene.addLayer(layer);
    console.log(layer);

  });
