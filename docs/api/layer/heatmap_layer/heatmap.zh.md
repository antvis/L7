---
title: HeatmapLayer
order: 0
---

# heatmapLayer

### 简介

热力图图层，包含三种类型的，

- 方格热力图

将一组点数据按照等大小的正方形网格进行聚合，一个正方形网格代表网格内所有点的统计值。方格热力图特点以方格网布局。

- 六边形热力图

将一组点数据按照等大小的六边形网格进行聚合，一个六边形网格代表网格内所有点的统计值。蜂窝热力图特点以六边形热力图网格布局

- 经典热力图

⚠️ 网格热力图和蜂窝热力图需要对数据聚合处理，使用之前需要在 source 方法设置数据聚合方法

### source

热力图只支持点数据作为数据源

布局方法 通过 source 的 tansforms 属性配置

- type  数据聚合类型 grid、hexagon
- size  网格半径 单位 米
- field  聚合字段
- method 聚合方法   count,max,min,sum,mean5 个统计维度

```javascript

layer.source(data, {
      parser: {
        type: 'csv',
        x: 'lng',
        y: 'lat'
      },
      transforms:[
        {
        type: 'grid',
        size: 15000,
        field:'v',
        method:'sum'
        }
      ],
  }
```

### shape

不同类型热力图 shape 支持

|              | 2D                             | 3d                                                |
| ------------ | ------------------------------ | ------------------------------------------------- |
| 网格格热力图 | circle,triangle,square,heaxgon | cylinder,triangleColumn,hexagonColum,squareColumn |
| 蜂窝热力图   | circle,triangle,square,heaxgon | circle,triangle,square,heaxgon                    |
| 普通热力图   | heatmap                        | heatmap                                           |

热力图布局下只 shape 方法只支持常量的可视化。

```javascript
HeatmapLayer.shape('square');
HeatmapLayer.shape('hexagon');
// 默认类型可以不设置
```

### size

当前版本 shape 为 grid，hexagon 不需要设置 size 映射

default 类型需要设置 size 映射 详细参数见[Size](https://www.yuque.com/antv/l7/layer#size)

**size(field,values) **

- field: 热力图权重字段
- values: 数据映射区间 热力图显示 [0, 1] 效果最佳

```javascript
HeatmapLayer.size('field', [0, 1]);
```

### color

default heatMap 类型不需设置 color 映射

color 配置项同 [**color**](https://www.yuque.com/antv/l7/layer#color)

### style

grid hexagon 可以通过 style 设置透明度

default 热力图需要通过 style 配置参数热力图参数

- intensity    全局热力权重     推荐权重范围 1-5
- radius   热力半径，单位像素
- rampColors 色带参数
  - colors  颜色数组
  - positions 数据区间

```javascript
HeatmapLayer.style({
  intensity: 3,
  radius: 20,
  rampColors: {
    colors: [
      'rgba(33,102,172,0.0)',
      'rgb(103,169,207)',
      'rgb(209,229,240)',
      'rgb(253,219,199)',
      'rgb(239,138,98)',
      'rgb(178,24,43,1.0)',
    ],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

### 完整代码示例

#### 普通热力图

```javascript
// 测试数据 url  https://gw.alipayobjects.com/os/basement_prod/08c6ea00-dc5f-4bb0-b0b5-52bde5edf0a3.json

HeatmapLayer({
  zIndex: 2,
})
  .source(data)
  .size('mag', [0, 1]) // weight映射通道
  .style({
    intensity: 3,
    radius: 20,
    rampColors: {
      colors: [
        'rgba(33,102,172,0.0)',
        'rgb(103,169,207)',
        'rgb(209,229,240)',
        'rgb(253,219,199)',
        'rgb(239,138,98)',
        'rgb(178,24,43,1.0)',
      ],
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

#### 网格热力图

```javascript
var layer = scene
  .HeatmapLayer({
    zIndex: 2,
  })
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng',
      y: 'lat',
    },
    transforms: [
      {
        type: 'grid',
        size: 15000,
        field: 'v',
        method: 'sum',
      },
    ],
  })
  .shape('grid')
  .style({
    coverage: 0.8,
  })
  .color('count', [
    '#002466',
    '#105CB3',
    '#2894E0',
    '#CFF6FF',
    '#FFF5B8',
    '#FFAB5C',
    '#F27049',
    '#730D1C',
  ]);
```

#### 六边形热力图

```javascript
var layer = scene
  .HeatmapLayer({
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
        type: 'hexgon',
        size: 1500,
        field: 'count',
        operation: 'sum',
      },
    ],
  })
  .shape('hexgon')
  .size(1000)
  .color('sum')
  .style({
    coverage: 0.8,
  });
render();
```
