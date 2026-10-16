import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [121.461531, 31.096775],
    zoom: 8.64,
    rotation: 358.78,
    pitch: 45.42056074766357,
    style: 'dark',
  }),
});

scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
);

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/0290a972-eedd-42f6-b69e-50a35e8a0824.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({})
        .source(data.slice(0, 50), {
          parser: {
            type: 'json',
            coordinates: 'coordinates',
          },
        })
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2, // 流线长度
        })
        .size(20)
        .shape('wall')
        .texture('02')
        .style({
          opacity: 1,
          lineTexture: true, // 开启线的贴图功能
          iconStep: 40, // 设置贴图纹理的间距
          iconStepCount: 4,
          sourceColor: '#00BCD2',
          targetColor: '#0074d0',
        });
      scene.addLayer(layer);
    });
});
