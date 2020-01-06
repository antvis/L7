import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.19382669582967, 30.258134 ],
    pitch: 0,
    style: 'light',
    zoom: 3
  })
});

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
      .size(18)
      .color('w', [ '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#d1e5f0', '#92c5de', '#4393c3', '#2166ac' ])
      .style({
        textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
        textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
        spacing: 2, // 字符间距
        padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
        stroke: 'red', // 描边颜色
        strokeWidth: 1, // 描边宽度
        strokeOpacity: 1.0
      });

    scene.addLayer(pointLayer);
  });
