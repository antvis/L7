import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.19382669582967, 30.258134 ],
    pitch: 20,
    zoom: 18,
    style: 'light'
  })
});
scene.on('loaded', () => {
  scene.addImage(
    '02',
    'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg'
  );
  fetch(
    'https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json'
  )
    .then(res => res.json())
    .then(data => {
      const layer = new LineLayer()
        .source(data)
        .size(4)
        .shape('line')
        .texture('02')
        .color('#25d8b7')
        .animate({
          interval: 1, // 间隔
          duration: 1, // 持续时间，延时
          trailLength: 2 // 流线长度
        })
        .style({
          lineTexture: true, // 开启线的贴图功能
          iconStep: 20 // 设置贴图纹理的间距
        });
      scene.addLayer(layer);
    });
});
