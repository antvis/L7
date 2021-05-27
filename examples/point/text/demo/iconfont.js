import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 110, 36 ],
    pitch: 0,
    style: 'light',
    zoom: 3
  })
});
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_99x8u6zpili.woff2?t=1621842922496';
scene.addFontFace(fontFamily, fontPath);
scene.addIconFont('icon1', '&#xe98c;');

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/rmsportal/oVTMqfzuuRFKiDwhPSFL.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w'
          }
        })
        .shape('m', 'text')
        .size(12)
        // .rotate("j",()=>{
        //   return  Math.random()*3*(Math.random()>0.5?1:-1)
        // })
        .color('w', [ '#0e0030', '#0e0030', '#0e0030' ])
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0
        });

      scene.addLayer(pointLayer);
    });

  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/70408903-80db-4278-a318-461604acb2df.json'
  )
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w'
          }
        })
        .shape('icon', 'text')
        .size(12)
        .color('w', [ '#f00', '#f00', '#0f0' ])
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ -10, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          fontFamily,
          iconfont: true
          // textAllowOverlap: true,
        });
      scene.addLayer(pointLayer);
    });
});
