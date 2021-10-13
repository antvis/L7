import { Scene, EarthLayer, LineLayer } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Earth({})
});

// TODO: 地球模式下背景色默认为 #000 通过 setBgColor 方法我们可以设置可视化层的背景色
scene.setBgColor('#333');

fetch(
  'https://gw.alipayobjects.com/os/basement_prod/a5ac7bce-181b-40d1-8a16-271356264ad8.json'
)
  .then(d => d.text())
  .then(flyline => {
    const flydata = JSON.parse(flyline).map(item => {
      const latlng1 = item.from.split(',').map(e => {
        return e * 1;
      });
      const latlng2 = item.to.split(',').map(e => {
        return e * 1;
      });
      return { coord: [ latlng1, latlng2 ] };
    });
    const flyLine = new LineLayer({ blend: 'normal' })
      .source(flydata, {
        parser: {
          type: 'json',
          coordinates: 'coord'
        }
      })
      .color('#b97feb')
      .shape('arc3d')
      .size(0.5)
      .active(true)
      .animate({
        interval: 2,
        trailLength: 2,
        duration: 1
      })
      .style({
        opacity: 1,
        segmentNumber: 60,
        globalArcHeight: 20
      });
    scene.addLayer(flyLine);
  });

const earthlayer = new EarthLayer()
  .source(
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image',
        extent: [ 121.168, 30.2828, 121.384, 30.4219 ]
      }
    }
  )
  .color('#2E8AE6')
  .shape('fill')
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
    opacity: 0.7
  });

scene.on('loaded', () => {
  scene.addLayer(earthlayer);

  scene.addLayer(atomLayer);
  scene.addLayer(bloomLayer);

  earthlayer.setEarthTime(4.0);
});
