---
title: 路径图
order: 0
---
<embed src="@/docs/common/style.md"></embed>

我们经常需要在地图上绘制诸如道路、行动路线、水系等常见的路径，可以将这些绘制线的统称为路径图，即用一组首尾不闭合的点坐标对来定位的线图层。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的路径图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/gallery/animate#animate_path_texture)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.15, 30.246 ],
    zoom: 13.5,
    style: 'dark',
    rotation: -90
  })
});
scene.addImage('arrow', 'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg');
fetch('https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json')
.then(res => res.json())
.then(data => {
  const layer = new LineLayer({})
    .source(data)
    .size(3)
    .shape('line')
    .texture('arrow')
    .color('rgb(22,119,255)')
    .animate({
      interval: 1, // 间隔
      duration: 1, // 持续时间，延时
      trailLength: 2 // 流线长度
    })
    .style({
      opacity: 0.6,
      lineTexture: true, // 开启线的贴图功能
      iconStep: 10, // 设置贴图纹理的间距
      borderWidth: 0.4, // 默认文 0，最大有效值为 0.5
      borderColor: '#fff' // 默认为 #ccc
    });
  scene.addLayer(layer);
});
```
### shape

我们一般将路径图的 `shape` 参数设置成 `line`。

### size

对于路径图，我们一般只要设置常量表示路径的宽度即可。

```javascript
layer.size(2); // 绘制宽度为 2 的路径
```
### style

<embed src="@/docs/api/line_layer/features/linear.zh.md"></embed>

<embed src="@/docs/api/line_layer/features/dash.zh.md"></embed>

<embed src="@/docs/api/line_layer/features/border.zh.md"></embed>

<embed src="@/docs/api/line_layer/features/texture.zh.md"></embed>

<embed src="@/docs/api/line_layer/features/animate.zh.md"></embed>
