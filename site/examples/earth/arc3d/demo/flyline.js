import { EarthLayer, LineLayer, Scene } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});

// 地球模式下背景色默认为 #000 通过 setBgColor 方法我们可以设置可视化层的背景色
scene.setBgColor('#333');

const earthlayer = new EarthLayer()
  .source('https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ', {
    parser: {
      type: 'image',
    },
  })
  .color('#2E8AE6')
  .shape('fill')
  .style({
    globalOptions: {
      ambientRatio: 0.6, // 环境光
      diffuseRatio: 0.4, // 漫反射
      specularRatio: 0.1, // 高光反射
    },
  })
  .animate(true);

const atomLayer = new EarthLayer().color('#2E8AE6').shape('atomSphere');

const bloomLayer = new EarthLayer().color('#fff').shape('bloomSphere').style({
  opacity: 0.7,
});

scene.on('loaded', () => {
  scene.addLayer(earthlayer);

  scene.addLayer(atomLayer);
  scene.addLayer(bloomLayer);

  fetch('https://gw.alipayobjects.com/os/bmw-prod/20a69b46-3d6d-4ab5-b8b5-150b6aa52c88.json')
    .then((res) => res.json())
    .then((flydata) => {
      const flyLine = new LineLayer({ blend: 'normal' })
        .source(flydata, {
          parser: {
            type: 'json',
            coordinates: 'coord',
          },
        })
        .color('#b97feb')
        .shape('arc3d')
        .size(0.5)
        .active(true)
        .animate({
          interval: 2,
          trailLength: 2,
          duration: 1,
        })
        .style({
          segmentNumber: 60,
          globalArcHeight: 20,
        });
      scene.addLayer(flyLine);
    });

  earthlayer.setEarthTime(4.0);
});
