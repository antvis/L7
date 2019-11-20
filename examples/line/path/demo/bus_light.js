import { Scene } from '@l7/scene';
import { LineLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  center: [103.83735604457024,1.360253881403068],
  pitch:  4.00000000000001,
  zoom: 10.210275860702593,
  rotation: 19.313180925794313,
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
          return [0.8 , level * 1]
        })
        .shape('line')
        .color(
          'level',
          [
            '#0A3663', '#1558AC',
            '#3771D9', '#4D89E5',
            '#64A5D3', '#72BED6',
            '#83CED6', '#A6E1E0',
            '#B8EFE2', '#D7F9F0'
          ].slice(0,8)
        )
    scene.addLayer(layer);
    console.log(layer);

  });
