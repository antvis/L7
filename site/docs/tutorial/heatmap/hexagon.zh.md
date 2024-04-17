---
title: 蜂窝热力图
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

将一组点数据按照等大小的六边形网格进行聚合，一个六边形网格代表网格内所有点的统计值。蜂窝热力图特点以六边形热力图网格布局。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*SLcGSbvZoEwAAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的蜂窝热力图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/heatmap/hexagon/#china)

```javascript
import { Scene, HeatmapLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    pitch: 43,
    center: [120.13383079335335, 29.651873105004427],
    zoom: 7.068989519212174,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/a1a8158d-6fe3-424b-8e50-694ccf61c4d7.csv')
    .then((res) => res.text())
    .then((data) => {
      const layer = new HeatmapLayer({})
        .source(data, {
          parser: {
            type: 'csv',
            x: 'lng',
            y: 'lat',
          },
          transforms: [
            {
              type: 'hexagon',
              size: 2500,
              field: 'v',
              method: 'sum',
            },
          ],
        })
        .size('sum', (sum) => {
          return sum * 200;
        })
        .shape('hexagonColumn')
        .style({
          coverage: 0.8,
          angle: 0,
        })
        .color('sum', [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#C3F9CC',
          '#DEFAC0',
          '#ECFFB1',
        ]);
      scene.addLayer(layer);
    });
});
```

### source

网格数据只支持点数据作为数据源，数据格式支持 `csv`、`json`、`geojson`。

#### 设置网格聚合参数

布局方法 通过 `source` 的 `transforms` 属性配置。

- type  数据聚合类型 `hexagon`。
- size  网格半径 单位 米。
- field  聚合字段。
- method 聚合方法 `count`，`max`，`min`，`sum`，`mean` 5 个统计维度。

```javascript
layer.source(data, {
  parser: {
    type: 'csv',
    x: 'lng',
    y: 'lat',
  },
  transforms: [
    {
      type: 'hexagon',
      size: 15000,
      field: 'v',
      method: 'sum',
    },
  ],
});
```

### shape

网格热力图虽然是以标准四边形网格进行数据聚合，但是展示效果上可以设置为其形状，形状只支持常量

#### 2d

- circle,
- triangle
- square
- heaxgon

```javascript
layer.shape('circle');
```

#### 3d

- cylinder
- triangleColumn
- hexagonColumn
- squareColumn,

```javascript
layer.shape('cylinder');
```

### size

### 2D shape

不需要设置 size 方法

### 3D 图形

size 表示高度, 支持常量和数据映射

```javascript
layer.size(10); // 常量
layer.size('value', [10, 50]); // 根据value 字段映射大小
layer.size('value', (value) => {}); // 回调函数设置高度
```

### style

- coverage 网格覆盖度 0 - 1
- angle 网格旋转角度 0 - 360
- opacity 透明度 0 - 1.0

```javascript
layer.style({
  coverage: 0.9,
  angle: 0,
  opacity: 1.0,
});
```
