import { Scene } from '@l7/scene';
import { Point3dLayer } from '@l7/layers'
const scene = new Scene({
  id: 'map',
  pitch: 65.68421052631578,
  type: 'amap',
  style: 'dark',
  center: [121.3917,31.259242],
  zoom: 14.55,
  rotation: 120

});
window.mapScene = scene;

fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
  .then((res) => res.json())
  .then((data) => {
    const pointLayer =
      new Point3dLayer({
      })
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude'
          }
        }).shape('name',['cylinder', 'triangleColumn', 'hexagonColumn','squareColumn'])
        .size('unit_price', (h)=>{
          return [ 6,6, h / 500 ]
        })
        .color('name',['#739DFF', "#61FCBF",'#FFDE74','#FF896F'])
        .style({
          opacity: 1.0,
        })

      scene.addLayer(pointLayer);

  });


