---
title: Hexagon HeatMap
order: 1
---
`markdown:docs/common/style.md`

将一组点数据按照等大小的六边形网格进行聚合，一个六边形网格代表网格内所有点的统计值。蜂窝热力图特点以六边形热力图网格布局

## 使用

```javascript
import { HeatMapLayer } from '@antv/l7';
```

## source

网格数据只支持点数据作为数据源，数据格式支持 csv、json、geojson.

#### 设置网格聚合参数

布局方法 通过 source 的 tansforms 属性配置

- type  数据聚合类型 hexagon
- size  网格半径 单位 米
- field  聚合字段
- method 聚合方法  count,max,min,sum,mean 5 个统计维度

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

## shape

网格热力图虽然是以标准四边形网格进行数据聚合，但是展示效果上可以设置为其形状，形状只支持常量

### 2d

- circle,
- triangle
- square
- heaxgon

```javascript
layer.shape('circle');
```

### 3d

- cylinder
- triangleColumn
- hexagonColumn
- squareColumn,

```javascript
layer.shape('cylinder');
```

## size

### 2D shape

不需要设置 size 方法

### 3D 图形

size 表示高度, 支持常量和数据映射

```javascript
layer.size(10); // 常量
layer.size('value', [10, 50]); // 根据value 字段映射大小
layer.size('value', (value) => {}); // 回调函数设置高度
```

## color

同 layer color 方法

## style

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

### 完整代码

```javascript
const layer = new HeatmapLayer({
  zIndex: 2,
})
  .souce(data, {
    parser: {
      type: 'csv',
      x: lng,
      y: lat,
    },
    transforms: [
      {
        type: 'hexagon',
        size: 1500,
        field: 'count',
        operation: 'sum',
      },
    ],
  })
  .shape('hexagon')
  .color('sum')
  .style({
    coverage: 0.8,
  });
```
`markdown:docs/common/layer/base.md`
