---
title: 文本标注
order: 6
---
<embed src="@/docs/common/style.md"></embed>

点图层支持绘制文本标注。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*7blvQ4v7Q1UAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的文本标注地图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/text/#point_text)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 110, 36 ],
    style: 'light',
    zoom: 3
  })
});
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
        .color('w', [ '#0e0030', '#0e0030', '#0e0030' ])
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [ 0, 0 ], // 文本相对锚点的偏移量 [水平, 垂直]
          spacing: 2, // 字符间距
          padding: [ 1, 1 ], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          strokeWidth: 0.3, // 描边宽度
        });
      scene.addLayer(pointLayer);
    });
});
```

### shape(field: name: shapeType: 'text'): ILayer

- `field` 标注的字段名称。
- `shapeType` 默认值为 `text`。

```javascript
layer.shape('name', 'text');
```

### style

- textAnchor `string` 文本相对锚点的位置
  `'right' | 'top-right' | 'left' | 'bottom-right' | 'left' | 'top-left' | 'bottom-left' | 'bottom' | 'bottom-right' | 'bottom-left' | 'top' | 'top-right' | 'top-left' | 'center';`
- padding: `number` 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
- spacing: number 文本间隔
- stroke: `string`; 描边颜色
- strokeWidth `number` 描边宽度
- strokeOpacity `number` 描边透明度
- fontWeight `string` 字体粗细
- fontFamily `string` 字号
- textOffset `[number, number]` 文本偏移量
- textAllowOverlap: `boolean` 是否允许文字遮盖
- raisingHeight 设置文本标注的抬升高度
