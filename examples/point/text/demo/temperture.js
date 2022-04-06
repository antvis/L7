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
  '//at.alicdn.com/t/font_2534097_x6rsov3i1g.woff2?t=1622107341225';
scene.addIconFont('icon', '&#xe69e;');
scene.addFontFace(fontFamily, fontPath);

const colors = [
  '#87CEFA',
  '#00BFFF',

  '#7FFFAA',
  '#00FF7F',
  '#32CD32',

  '#F0E68C',
  '#FFD700',

  '#FF7F50',
  '#FF6347',
  '#FF0000'
];

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/94763191-2816-4c1a-8d0d-8bcf4181056a.json')
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
        .size(25)
        .color('count', t => {
          const c = Number(t.replace('℃', ''));
          return colors[Math.floor(((c - 18) / 16) * 10)];
        })
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ -25, 15 ],
          padding: [ 2, 2 ],
          fontFamily,
          iconfont: true,
          textAllowOverlap: true
        });
      scene.addLayer(pointLayer);

      const tempertureLayer = new PointLayer({
        zIndex: 10
      })
        .source(data)
        .shape('count', 'text')
        .size(12)
        .color('count', t => {
          const c = Number(t.replace('℃', ''));
          return colors[Math.floor(((c - 18) / 16) * 10)];
        })
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 35, 30 ],
          padding: [ 1, 1 ]
        });
      scene.addLayer(tempertureLayer);

    });
});
