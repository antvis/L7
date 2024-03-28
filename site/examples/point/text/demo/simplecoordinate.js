import { ImageLayer, PointLayer, Scene } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [500, 500],
    zoom: 3,
    version: 'SIMPLE',
    mapSize: 1000,
    maxZoom: 5,
    minZoom: 2,
    pitchEnabled: false,
    rotateEnabled: false,
  }),
});
scene.setBgColor('rgb(94, 182, 140)');

const imagelayer = new ImageLayer({}).source(
  'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*I0X5R4jAUQ4AAAAAAAAAAAAAARQnAQ',
  {
    parser: {
      type: 'image',
      extent: [360, 400, 640, 600],
    },
  },
);

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/7dc0d454-fabc-4461-a5d5-d404dadb49a9.json')
    .then((res) => res.json())
    .then((data) => {
      const textlayer = new PointLayer({ zIndex: 2 })
        .source(data, {
          parser: {
            type: 'json',
            x: 'x',
            y: 'y',
          },
        })
        .shape('t', 'text')
        .size(12)
        .active({
          color: '#00f',
          mix: 0.9,
        })
        .color('rgb(86, 156, 214)')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          spacing: 2, // 字符间距
          fontWeight: '800',
          padding: [1, 1], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 2, // 描边宽度
          textAllowOverlap: true,
        });
      scene.addLayer(textlayer);
    });

  scene.addLayer(imagelayer);
});
