import { Scene, PointLayer, EarthLayer } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Earth({})
});

const earthlayer = new EarthLayer()
  .source(
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image'
      }
    }
  )
  .shape('base')
  .style({
    opacity: 1.0,
    radius: 40,
    globelOtions: {
      ambientRatio: 0.6, // 环境光
      diffuseRatio: 0.4, // 漫反射
      specularRatio: 0.1 // 高光反射
    }
  })
  .animate(true);

const atomLayer = new EarthLayer()
  .color('#2E8AE6')
  .shape('atomSphere')
  .style({
    opacity: 1
  });

const bloomLayer = new EarthLayer().color('#fff').shape('bloomSphere')
  .style({
    opacity: 0.6
  });

scene.on('loaded', () => {
  scene.addLayer(earthlayer);
  fetch('https://gw.alipayobjects.com/os/bmw-prod/efef6c2b-2922-4c03-b9e0-d3743f68eaf2.json')
    .then(res => res.json())
    .then(data => {
      const pointlayer = new PointLayer()
        .source(data,
          {
            parser: {
              type: 'json',
              x: 'lng',
              y: 'lat'
            }
          }
        )
        .shape('circle')
        .color('#f00')
        .size(10)
        .active(true);
      scene.addLayer(pointlayer);
    });

  scene.addLayer(atomLayer);
  scene.addLayer(bloomLayer);

  earthlayer.setEarthTime(4.0);
});
