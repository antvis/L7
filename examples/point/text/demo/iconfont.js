import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 115, 30 ],
    pitch: 0,
    style: 'light',
    zoom: 6
  })
});
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
scene.addFontFace(fontFamily, fontPath);
scene.addIconFont('icon1', '&#xe6d4;');

scene.on('loaded', () => {
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
        .size(20)
        .color('w', ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'])
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 40, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
          padding: [ 0, 0 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          fontFamily,
          iconfont: true,
          textAllowOverlap: true,
        });
      scene.addLayer(pointLayer);
    });
});
