import { Scene, PointLayer, PolygonLayer, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 40,
    center: [ 118.8, 32.056 ],
    zoom: 12.5
  })
});
const fontFamily = 'iconfont';
const fontPath =
  '//at.alicdn.com/t/font_2534097_bl34aphh10n.woff2?t=1622180820063';
scene.addIconFont('up', '&#xe61d;');
scene.addIconFont('down', '&#xe61e;');
scene.addFontFace(fontFamily, fontPath);


scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/41802695-0f7e-4a81-ab16-539c4e39df0d.json'
  )
    .then(res => res.json())
    .then(data => {
      const filllayer = new PolygonLayer({
        name: 'fill',
        zIndex: 3
      })
        .source(data)
        .shape('fill')
        .color('count', [ '#f2f0f7', '#dadaeb', '#bcbddc', '#9e9ac8', '#756bb1', '#54278f' ])
        .style({
          opacity: 0.6,
          opacityLinear: {
            enable: true,
            dir: 'out' // in - out
          }
        });
      scene.addLayer(filllayer);

      const linelayer = new LineLayer({
        zIndex: 5,
        name: 'line2'
      })
        .source(data)
        .shape('line')
        .size(1)
        .color('#fff')
        .style({
          opacity: 0.3
        });
      scene.addLayer(linelayer);

      const pointLayer = new PointLayer({
        zIndex: 10
      })
        .source(data)
        .shape('icon', 'text')
        .size(15)
        .color('count', n => (n > 0 ? '#0f0' : '#f00'))
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 30, 5 ],
          padding: [ 2, 2 ],
          fontFamily,
          iconfont: true
          // textAllowOverlap: true
        });
      scene.addLayer(pointLayer);

      const textLayer = new PointLayer({
        zIndex: 10
      })
        .source(data)
        .shape('count', 'text')
        .size(12)
        .color('count', n => (n > 0 ? '#0f0' : '#f00'))
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 40, 10 ],
          padding: [ 1, 1 ]
        });
      scene.addLayer(textLayer);
    });
});
