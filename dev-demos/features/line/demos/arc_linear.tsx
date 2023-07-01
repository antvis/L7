import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';

export default () => {
  useEffect(() => {


const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.5, 30.2 ],
    style: 'dark',
    zoom: 7.5,
    zooms: [ 8, 10 ]
  })
});

const fontFamily = 'iconfont';
const fontPath =
  '//at.alicdn.com/t/font_2534097_ao9soua2obv.woff2?t=1622021146076';
scene.addIconFonts([
  [ 'smallRain', '&#xe6f7;' ],
  [ 'middleRain', '&#xe61c;' ],
  [ 'hugeRain', '&#xe6a6;' ],
  [ 'sun', '&#xe6da;' ],
  [ 'cloud', '&#xe8da;' ]
]);
scene.addFontFace(fontFamily, fontPath);
scene.on('loaded', () => {

  fetch('https://gw.alipayobjects.com/os/bmw-prod/f7d083e2-ad55-44fd-b324-15e1b549948a.json')
    .then(res => res.json())
    .then(data => {
      const pointIconFontLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('iconType', 'text')
        .size(30)
        .color('red')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset:[0,0],
          // textOffset: {
          //   field:'textOffset',
          //   values:d => d
          // }, // 文本相对锚点的偏移量 [水平, 垂直]
          fontFamily,
          iconfont: true,
          textAllowOverlap: true
        });
      scene.addLayer(pointIconFontLayer);

      const textLayer = new PointLayer({})
        .source(data, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('weather', 'text')
        .size(16)
        .color('#fff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          fontFamily: 'Times New Roman',
          textAllowOverlap: true
        });
      scene.addLayer(textLayer);
    });

});

      
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
