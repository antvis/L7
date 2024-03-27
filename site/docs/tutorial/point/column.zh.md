---
title: 3D 柱图
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

`3D` 柱图是在地理区域上方显示的不同高度的柱体，柱子的高度与其在数据集中的数值会成正比。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*RVw4QKTJe7kAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的 `3D` 柱图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/column/#clumn_shape)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    pitch: 66.02383,
    center: [ 121.400257, 31.25287 ],
    zoom: 14.55,
    rotation: 134.95
  })
});
fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
  .then(res => res.json())
  .then(data => {
    const pointLayer = new PointLayer({})
    .source(data, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude'
      }
    })
    .shape('name', [ 'cylinder', 'triangleColumn', 'hexagonColumn', 'squareColumn' ])
    .color('name', [ '#739DFF', '#61FCBF', '#FFDE74', '#FF896F' ]);
    .size('unit_price', h => [ 6, 6, h / 500 ]
    scene.addLayer(pointLayer);
  })
```

### shape

`3D` 柱图 `shape` 方法支持以下参数：

- `cylinder` 圆柱体
- `triangleColumn` 三角柱
- `hexagonColumn` 六角柱
- `squareColumn` 四角柱

### size

`3D` 柱图的 `size` 支持设置三个维度 `[w, l, z]`：

- `w` 宽
- `l` 长
- `z` 高度

1. `size` 设置常量

```js
layer.size([2, 2, 3]);
```

2. `size` 设置回调函数

```js
layer.size('unit_price', (h) => {
  return [6, 6, h / 500];
});
```

### animate

`3D` 柱图支持生长动画，通过 `animate` 方法进行设置，具体使用可以查看[详细文档](/api/point_layer/animate#生长动画)

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*l-SUQ5nU6n8AAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### style

`3D` 柱图有特殊的 `style` 属性，具体使用可以查找[详细文档](/api/point_layer/style#3d-column)
