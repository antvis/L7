---
skill_id: heatmap-layer
skill_name: 热力图层
category: layers
difficulty: beginner
tags: [heatmap, layer, density, heat-visualization, intensity]
dependencies: [scene-initialization, source-geojson]
version: 2.x
---

# 热力图层

## 技能描述

使用颜色梯度展示地理空间数据的密度或强度分布，适合表现数据的聚集程度和热度区域。

## 何时使用

- ✅ 显示数据密度分布（人口密度、POI 密度）
- ✅ 展示热点区域（犯罪热点、事故高发区）
- ✅ 可视化强度分布（温度分布、污染程度）
- ✅ 分析空间聚集模式（用户活跃区域、订单集中区）
- ✅ 网格热力图（蜂窝热力图、方格热力图）

## 前置条件

- 已完成[场景初始化](../core/scene.md)
- 准备好点位数据（包含经纬度和权重值）

## 输入参数

### 数据格式

```typescript
interface HeatmapData {
  lng: number; // 经度
  lat: number; // 纬度
  value?: number; // 权重值（可选，默认为 1）
  [key: string]: any;
}
```

### 图层配置

| 方法                   | 参数                             | 说明                                    |
| ---------------------- | -------------------------------- | --------------------------------------- |
| `source(data, config)` | data: 数据数组                   | 设置数据源                              |
| `shape(type)`          | type: 形状类型                   | heatmap \| heatmap3D \| hexagon \| grid |
| `size(field, range)`   | field: 聚合字段, range: 映射范围 | 设置热力大小                            |
| `color(colors)`        | colors: 颜色数组                 | 设置颜色渐变                            |
| `style(config)`        | config: 样式对象                 | 设置样式参数                            |

## 输出

返回 `HeatmapLayer` 实例

## 代码示例

### 基础用法 - 经典热力图

```javascript
import { HeatmapLayer } from '@antv/l7';

const data = [
  { lng: 120.19, lat: 30.26, value: 100 },
  { lng: 120.2, lat: 30.27, value: 200 },
  { lng: 120.21, lat: 30.28, value: 150 },
  { lng: 120.19, lat: 30.29, value: 300 },
];

scene.on('loaded', () => {
  const heatmapLayer = new HeatmapLayer()
    .source(data, {
      parser: {
        type: 'json',
        x: 'lng',
        y: 'lat',
      },
    })
    .shape('heatmap')
    .size('value', [0, 1])
    .style({
      intensity: 3, // 热力强度
      radius: 20, // 热力半径
      opacity: 1.0, // 透明度
      rampColors: {
        colors: ['#2E8AE6', '#69D1AB', '#DAF291', '#FFE234', '#FF7C6A', '#FF4818'],
        positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
      },
    });

  scene.addLayer(heatmapLayer);
});
```

### 3D 热力图

```javascript
const heatmap3DLayer = new HeatmapLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
    transforms: [
      {
        type: 'hexagon',
        size: 1000, // 六边形网格大小
        field: 'value',
        method: 'sum', // 聚合方式：sum | max | min | mean
      },
    ],
  })
  .shape('heatmap3D')
  .size('sum', [0, 600]) // 3D 高度映射
  .color('sum', [
    '#0B1678',
    '#1E3EAD',
    '#2E8AE6',
    '#69D1AB',
    '#DAF291',
    '#FFE234',
    '#FF7C6A',
    '#FF4818',
  ])
  .style({
    coverage: 0.9, // 覆盖度
    angle: 0, // 旋转角度
    opacity: 1.0,
  });

scene.addLayer(heatmap3DLayer);
```

### 蜂窝热力图

```javascript
const hexagonLayer = new HeatmapLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
    transforms: [
      {
        type: 'hexagon',
        size: 500, // 六边形大小（米）
        field: 'value',
        method: 'sum',
      },
    ],
  })
  .shape('hexagon')
  .color('sum', ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494'])
  .style({
    coverage: 0.8,
    angle: 0,
  });

scene.addLayer(hexagonLayer);
```

### 方格热力图

```javascript
const gridLayer = new HeatmapLayer()
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
    transforms: [
      {
        type: 'grid',
        size: 1000, // 方格大小（米）
        field: 'value',
        method: 'sum',
      },
    ],
  })
  .shape('square')
  .color('sum', ['#feedde', '#fdd0a2', '#fdae6b', '#fd8d3c', '#e6550d', '#a63603'])
  .style({
    coverage: 1, // 完全覆盖
  });

scene.addLayer(gridLayer);
```

### 自定义配置 - 高级用法

```javascript
const advancedHeatmap = new HeatmapLayer({
  name: 'custom-heatmap',
  blend: 'additive', // 混合模式
})
  .source(data, {
    parser: {
      type: 'json',
      x: 'lng',
      y: 'lat',
    },
  })
  .shape('heatmap')
  .size('value', (value) => {
    // 自定义大小映射函数
    return Math.sqrt(value) / 100;
  })
  .style({
    intensity: 2,
    radius: 25,
    opacity: 0.8,
    rampColors: {
      colors: [
        'rgba(33,102,172,0)',
        'rgb(103,169,207)',
        'rgb(209,229,240)',
        'rgb(253,219,199)',
        'rgb(239,138,98)',
        'rgb(178,24,43)',
      ],
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });

scene.addLayer(advancedHeatmap);
```

## 样式配置详解

### 经典热力图样式

```javascript
{
  intensity: 3,        // 热力强度，值越大颜色越浓，范围 1-10
  radius: 20,          // 热力半径（像素），影响扩散范围
  opacity: 1.0,        // 整体透明度，0-1
  rampColors: {
    colors: [...],     // 颜色数组，从低到高
    positions: [...]   // 颜色位置，0-1，需与 colors 对应
  }
}
```

### 3D/网格热力图样式

```javascript
{
  coverage: 0.9,       // 覆盖度，0-1，控制网格间距
  angle: 0,            // 旋转角度，0-360
  opacity: 1.0         // 透明度
}
```

## 常见场景

### 1. 人口密度分析

```javascript
const populationHeatmap = new HeatmapLayer()
  .source(populationData, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('heatmap')
  .size('population', [0, 1])
  .style({
    intensity: 3,
    radius: 30,
    rampColors: {
      colors: [
        '#FFFFCC',
        '#FFEDA0',
        '#FED976',
        '#FEB24C',
        '#FD8D3C',
        '#FC4E2A',
        '#E31A1C',
        '#BD0026',
        '#800026',
      ],
      positions: [0, 0.1, 0.2, 0.3, 0.4, 0.6, 0.7, 0.85, 1.0],
    },
  });
```

### 2. 实时订单热力

```javascript
const orderHeatmap = new HeatmapLayer()
  .source(orderData, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('heatmap3D')
  .size('order_count', [0, 500])
  .color('order_count', ['#440154', '#3b528b', '#21908c', '#5dc863', '#fde725'])
  .style({
    coverage: 0.8,
    opacity: 0.8,
  });

// 定时更新数据
setInterval(() => {
  fetch('/api/realtime-orders')
    .then((res) => res.json())
    .then((newData) => {
      orderHeatmap.setData(newData);
    });
}, 5000);
```

### 3. 交通事故热点

```javascript
const accidentHeatmap = new HeatmapLayer()
  .source(accidentData, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
    transforms: [
      {
        type: 'hexagon',
        size: 500,
        field: 'severity',
        method: 'max',
      },
    ],
  })
  .shape('hexagon')
  .color('max', [
    '#f7fbff',
    '#deebf7',
    '#c6dbef',
    '#9ecae1',
    '#6baed6',
    '#4292c6',
    '#2171b5',
    '#084594',
  ]);
```

## 性能优化

### 1. 数据量优化

```javascript
// 大数据量时使用网格聚合
const layer = new HeatmapLayer()
  .source(bigData, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
    transforms: [
      {
        type: 'grid',
        size: 2000, // 增大网格减少计算量
        field: 'value',
        method: 'sum',
      },
    ],
  })
  .shape('square');
```

### 2. 降低渲染精度

```javascript
layer.style({
  radius: 15, // 减小半径
  intensity: 2, // 降低强度
  opacity: 0.8,
});
```

### 3. 使用抽样

```javascript
// 数据抽样，适合超大数据集
const sampledData = data.filter((_, index) => index % 10 === 0);

layer.source(sampledData, {
  /* config */
});
```

## 注意事项

⚠️ **数据量**：经典热力图建议数据量在 10 万以内，超过建议使用网格热力图

⚠️ **颜色位置**：`rampColors.positions` 必须是递增的 0-1 数组，长度需与 colors 对应

⚠️ **半径设置**：`radius` 过大会导致性能下降，建议 10-50 像素

⚠️ **权重字段**：如果数据没有权重字段，系统会为每个点赋予默认权重 1

⚠️ **坐标系统**：确保经纬度数据正确，经度范围 -180~180，纬度范围 -90~90

## 常见问题

### Q: 热力图颜色不明显？

A: 增加 `intensity` 参数或增大 `radius` 值

### Q: 3D 热力图高度不明显？

A: 调整 `size()` 方法的映射范围，如 `[0, 1000]`

### Q: 网格热力图出现空洞？

A: 增大 `coverage` 参数至 1.0，或减小网格 `size`

### Q: 数据更新后热力图不刷新？

A: 使用 `layer.setData(newData)` 或 `scene.render()`

### Q: 热力图边界被裁切？

A: 调整地图的 `padding` 或使用 `fitBounds()` 方法

## 相关技能

- [点图层](./point.md)
- [面图层](./polygon.md)
- [数据映射](../visual/mapping.md)
- [数据聚合](../data/source-parser.md)

## 在线示例

查看更多示例: [L7 官方示例 - 热力图](https://l7.antv.antgroup.com/examples/heatmap/heatmap)
