import { Scene, PolygonLayer, LineLayer, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [ 120, 29.732983 ],
    zoom: 6.2,
    pitch: 60
  })
});
scene.on('loaded', () => {
  let lineDown,
    lineUp,
    textLayer;

  fetch('https://gw.alipayobjects.com/os/bmw-prod/ecd1aaac-44c0-4232-b66c-c0ced76d5c7d.json')
    .then(res => res.json())
    .then(data => {
      const texts = [];

      data.features.map(option => {
        const { name, center } = option.properties;
        const [ lng, lat ] = center;
        texts.push({ name, lng, lat });
        return '';
      });

      textLayer = new PointLayer({ zIndex: 2 })
        .source(texts, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat'
          }
        })
        .shape('name', 'text')
        .size(14)
        .color('#0ff')
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          spacing: 2, // 字符间距
          padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#0ff', // 描边颜色
          strokeWidth: 0.2, // 描边宽度
          raisingHeight: 200000 + 150000 + 10000,
          textAllowOverlap: true
        });
      scene.addLayer(textLayer);

      lineDown = new LineLayer()
        .source(data)
        .shape('line')
        .color('#0DCCFF')
        .size(1)
        .style({
          raisingHeight: 200000
        });

      lineUp = new LineLayer({ zIndex: 1 })
        .source(data)
        .shape('line')
        .color('#0DCCFF')
        .size(1)
        .style({
          raisingHeight: 200000 + 150000
        });

      scene.addLayer(lineDown);
      scene.addLayer(lineUp);
      return '';
    });

  fetch('https://gw.alipayobjects.com/os/bmw-prod/d434cac3-124e-4922-8eed-ccde01674cd3.json')
    .then(res => res.json())
    .then(data => {
      const lineLayer = new LineLayer()
        .source(data)
        .shape('wall')
        .size(150000)
        .style({
          heightfixed: true,
          opacity: 0.6,
          sourceColor: '#0DCCFF',
          targetColor: 'rbga(255,255,255, 0)'
        });
      scene.addLayer(lineLayer);

      const provincelayer = new PolygonLayer({})
        .source(data)
        .size(150000)
        .shape('extrude')
        .color('#0DCCFF')
        .active({
          color: 'rgb(100,230,255)'
        })
        .style({
          heightfixed: true,
          pickLight: true,
          raisingHeight: 200000,
          opacity: 0.8
        });

      scene.addLayer(provincelayer);

      provincelayer.on('mousemove', () => {
        provincelayer.style({
          raisingHeight: 200000 + 100000
        });
        lineDown.style({
          raisingHeight: 200000 + 100000
        });
        lineUp.style({
          raisingHeight: 200000 + 150000 + 100000
        });
        textLayer.style({
          raisingHeight: 200000 + 150000 + 10000 + 100000
        });
      });

      provincelayer.on('unmousemove', () => {
        provincelayer.style({
          raisingHeight: 200000
        });
        lineDown.style({
          raisingHeight: 200000
        });
        lineUp.style({
          raisingHeight: 200000 + 150000
        });
        textLayer.style({
          raisingHeight: 200000 + 150000 + 10000
        });
      });
      return '';
    });
  return '';
});
