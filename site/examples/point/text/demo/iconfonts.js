import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.5, 30.2],
    style: 'dark',
    zoom: 8.5,
    zooms: [8, 10],
  }),
});
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';
scene.addFontFace(fontFamily, fontPath);
scene.addIconFonts([
  ['smallRain', '&#xe6f7;'],
  ['middleRain', '&#xe61c;'],
  ['hugeRain', '&#xe6a6;'],
  ['sun', '&#xe6da;'],
  ['cloud', '&#xe8da;'],
]);

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/9eb3f1b5-0c3b-49b2-8221-191d4ba8aa5e.json')
    .then((res) => res.json())
    .then((originData) => {
      const layer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('backgoundColor')
        .size(42);
      scene.addLayer(layer);

      const pointIconFontLayer = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('iconType', 'text')
        .size(30)
        .color('iconColor')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [-10, 10], // 文本相对锚点的偏移量 [水平, 垂直]
          fontFamily,
          iconfont: true,
          textAllowOverlap: true,
        });
      scene.addLayer(pointIconFontLayer);

      const textLayer = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('temperature', 'text')
        .size(10)
        .color('#ffffff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [5, -55], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0,
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer);

      const textLayer2 = new PointLayer({})
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('weather', 'text')
        .size(14)
        .color('#ffffff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [5, -15], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
          strokeOpacity: 1.0,
          fontFamily: 'Times New Roman',
          textAllowOverlap: true,
        });
      scene.addLayer(textLayer2);
    });
});
