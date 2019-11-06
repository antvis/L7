import { Scene } from '@l7/scene';
import { PointLayer, PointImageLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 0,
  type: 'amap',
  style: 'light',
  center: [121.40, 31.258134],
  zoom: 15,
});

fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
  .then((res) => res.json())
  .then((data) => {
    const pointLayer =
      new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude'
          }
        }).shape('circle')
        .size(8)
        .color('count',['#d73027','#fc8d59','#fee08b','#d9ef8b','#91cf60','#1a9850'])
        .style({
          opacity: 1.0,
          strokeWidth: 2,
          strokeColor: "#fff",

        })
        scene.addImage(
          '00',
          'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*kzTMQqS2QdUAAAAAAAAAAABkARQnAQ',
        );
   const imageLayer = new PointImageLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'longitude',
          y: 'latitude'
        }
      })
      .shape('00')
      .size(30);
      scene.addLayer(imageLayer);
    // scene.on('loaded',()=>{
    //   console.log('----------loaded')
      scene.addLayer(pointLayer);
    // })
    console.log(scene);
   scene.on('loaded',()=>{
      console.log(scene.map);
   })
    scene.render();
  });


