---
skill_id: visual-mapping
skill_name: 视觉映射
category: visual
difficulty: intermediate
tags: [color, size, shape, scale, mapping, visual-encoding]
dependencies: [scene-initialization, point-layer]
version: 2.x
---

# 视觉映射

## 技能描述

将数据字段映射到图层的视觉属性（颜色、大小、形状等），实现数据的可视化编码。

## 何时使用

- ✅ 根据数值字段设置不同颜色（热力分布、分级着色）
- ✅ 根据数据值调整图形大小（气泡图、比例符号）
- ✅ 使用不同形状表示分类数据（POI 类型、事件类别）
- ✅ 多维数据可视化（颜色+大小+形状组合）
- ✅ 动态数据范围映射（自适应色阶）

## 前置条件

- 已完成[场景初始化](../01-core/scene-initialization.md)
- 已创建图层（[点图层](../03-layers/point-layer.md)、[线图层](../03-layers/line-layer.md)等）
- 数据中包含用于映射的字段

## 核心概念

### 映射类型

| 映射方式 | 数据类型  | 适用场景   | 示例                                          |
| -------- | --------- | ---------- | --------------------------------------------- |
| 固定值   | -         | 统一样式   | `.color('#5B8FF9')`                           |
| 字段映射 | 连续/分类 | 数据驱动   | `.color('temperature', [...])`                |
| 回调函数 | 任意      | 自定义逻辑 | `.color(d => d.value > 100 ? 'red' : 'blue')` |

## 代码示例

### 颜色映射 (color)

#### 1. 固定颜色

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('#5B8FF9'); // 所有点使用相同颜色
```

#### 2. 字段映射 - 连续数值

```javascript
// 根据温度值映射颜色（蓝色到红色渐变）
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('temperature', [
    '#313695', // 低温
    '#4575b4',
    '#74add1',
    '#abd9e9',
    '#e0f3f8',
    '#ffffbf',
    '#fee090',
    '#fdae61',
    '#f46d43',
    '#d73027',
    '#a50026', // 高温
  ]);
```

#### 3. 字段映射 - 分类数据

```javascript
// 根据类型字段映射不同颜色
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('type', ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#CCCCCC']);

// 如果需要固定 domain 顺序，可以设置 scale
layer
  .scale('type', {
    type: 'cat',
    domain: ['餐饮', '购物', '娱乐', '酒店', '其他'],
  })
  .color('type', ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181', '#CCCCCC']);
```

#### 4. 回调函数映射

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color((feature) => {
    const value = feature.value;
    if (value > 1000) return '#d73027';
    if (value > 500) return '#fdae61';
    if (value > 100) return '#fee090';
    return '#abd9e9';
  });
```

### 大小映射 (size)

#### 1. 固定大小

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(15) // 所有点大小为 15
  .color('#5B8FF9');
```

#### 2. 字段映射 - 数值范围

```javascript
// 根据人口数量映射点的大小
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size('population', [5, 50]) // 人口越多，点越大（5-50像素）
  .color('#5B8FF9');
```

#### 3. 字段映射 - 3D 高度

```javascript
// 3D 柱状图：根据数值映射高度
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('cylinder')
  .size('value', [0, 1000]) // 映射到 0-1000 米高度
  .color('value', ['#ffffcc', '#800026'])
  .style({
    opacity: 0.8,
  });
```

#### 4. 回调函数映射

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size((feature) => {
    // 根据业务逻辑自定义大小
    const value = feature.sales;
    return Math.sqrt(value) / 10; // 平方根缩放
  })
  .color('#5B8FF9');
```

### 形状映射 (shape)

#### 1. 固定形状

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle') // 圆形
  .size(10)
  .color('#5B8FF9');
```

#### 2. 字段映射 - 分类形状

```javascript
// 根据类型使用不同形状
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('category', {
    A类: 'circle',
    B类: 'triangle',
    C类: 'square',
    D类: 'hexagon',
  })
  .size(15)
  .color('category', ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181']);
```

#### 3. 图标映射

```javascript
// 使用自定义图标
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('icon', 'category') // 根据 category 字段映射图标
  .size(20)
  .style({
    A类: 'restaurant',
    B类: 'shop',
    C类: 'hotel',
  });
```

### 多维映射组合

```javascript
// 同时映射颜色、大小、形状
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('type', {
    高风险: 'triangle',
    中风险: 'square',
    低风险: 'circle',
  })
  .size('impact', [5, 30]) // 影响程度控制大小
  .color('severity', ['#fee5d9', '#fcae91', '#fb6a4a', '#de2d26', '#a50f15'])
  .style({
    opacity: 0.8,
    strokeWidth: 2,
    stroke: '#fff',
  });
```

## 色阶配置

### 内置色阶

```javascript
// ColorBrewer 色阶
import { scales } from '@antv/l7';

layer.color('value', scales.quantize.Blues); // 蓝色系
layer.color('value', scales.quantize.Reds); // 红色系
layer.color('value', scales.quantize.Greens); // 绿色系
layer.color('value', scales.diverging.RdYlBu); // 红-黄-蓝发散色
```

### 自定义色阶

```javascript
// 线性插值色阶
const colorScale = [
  '#f7fbff',
  '#deebf7',
  '#c6dbef',
  '#9ecae1',
  '#6baed6',
  '#4292c6',
  '#2171b5',
  '#08519c',
  '#08306b',
];

// threshold 类型示例
layer
  .scale('value', {
    type: 'threshold',
    domain: [100, 500, 1000, 5000], // N个断点对应 N+1 个颜色
  })
  .color('value', ['#ffffcc', '#c7e9b4', '#7fcdbb', '#41b6c4', '#2c7fb8', '#253494']);
```

## 高级用法

### 动态更新映射

```javascript
const layer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(10)
  .color('value', ['#ffffcc', '#800026']);

// 切换到另一个字段
function switchField(fieldName) {
  layer.color(fieldName, ['#fee5d9', '#a50f15']);
  scene.render();
}

// 更新颜色范围
function updateColors(colors) {
  layer.color('value', colors);
  scene.render();
}
```

### Scale 配置

L7 使用 `scale()` 方法设置数据字段的映射方式，将地图数据值（数字、日期、类别等）转换为视觉属性（颜色、大小、形状等）。

```javascript
// 先配置 scale，再进行 color/size 映射
layer
  .scale('mag', {
    type: 'linear',
    domain: [1, 50],
  })
  .color('id', ['#f00', '#ff0'])
  .size('mag', [1, 80]);
```

### Scale 配置参数

```typescript
interface IScaleConfig {
  type:
    | 'linear'
    | 'log'
    | 'pow'
    | 'quantile'
    | 'quantize'
    | 'threshold'
    | 'cat'
    | 'time'
    | 'sequential'
    | 'diverging'
    | 'identity';
  domain?: any[]; // 数据值域范围
  range?: any[]; // 视觉值映射范围（通常使用 color/size 方法设置）
  unknown?: string; // 未知值的默认映射
  nice?: boolean; // 是否优化边界值
  clamp?: boolean; // 是否限制在范围内
}
```

### Scale 使用规则

| Scale 类型 | domain 设置 | 说明                              |
| ---------- | ----------- | --------------------------------- |
| linear     | 可选        | 不设置会自动计算 min、max         |
| quantize   | 可选        | 不设置会自动计算 min、max         |
| quantile   | 不可设置    | 必须自动计算，需要全量数据        |
| threshold  | 必须设置    | N 个断点需要 N+1 个颜色           |
| diverging  | 可选        | 不设置会自动计算 min、middle、max |
| cat        | 可选        | 不设置会自动获取唯一值            |

### 使用示例

```javascript
// 组合使用 scale 和映射
const layer = new PointLayer()
  .source(data, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .scale('population', {
    type: 'linear',
    domain: [0, 10000000],
  })
  .scale('category', {
    type: 'cat',
  })
  .size('population', [5, 50])
  .color('category', ['#FF6B6B', '#4ECDC4', '#95E1D3']);
```

## 常见场景

### 1. 人口密度分级着色

```javascript
const populationLayer = new PolygonLayer()
  .source(districtData, { parser: { type: 'geojson' } })
  .shape('fill')
  .scale('population_density', {
    type: 'quantile', // 分位数映射
  })
  .color('population_density', [
    '#f7fbff',
    '#deebf7',
    '#c6dbef',
    '#9ecae1',
    '#6baed6',
    '#4292c6',
    '#2171b5',
    '#084594',
  ])
  .style({
    opacity: 0.8,
  });
```

### 2. 气泡图（双变量映射）

```javascript
// 颜色表示类型，大小表示数量
const bubbleLayer = new PointLayer()
  .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size('amount', [10, 80]) // 交易金额
  .color('category', ['#FF6B6B', '#4ECDC4', '#95E1D3', '#F38181']) // 类别
  .style({
    opacity: 0.6,
    strokeWidth: 2,
    stroke: '#fff',
  });
```

### 3. 热力强度可视化

```javascript
const heatLayer = new PointLayer()
  .source(eventData, { parser: { type: 'json', x: 'lng', y: 'lat' } })
  .shape('circle')
  .size(15)
  .color('intensity', ['#440154', '#31688e', '#35b779', '#fde724'])
  .style({
    opacity: 0.8,
  });
```

### 4. 三维数据可视化

```javascript
// 建筑高度 + 颜色表示用途
const buildingLayer = new PolygonLayer()
  .source(buildingData, { parser: { type: 'geojson' } })
  .shape('extrude')
  .size('height', [10, 500]) // 建筑高度
  .scale('usage', {
    type: 'cat',
    domain: ['住宅', '商业', '办公', '工业', '其他'],
  })
  .color('usage', ['#FFE5B4', '#FF6B6B', '#4ECDC4', '#95E1D3', '#CCCCCC'])
  .style({
    opacity: 0.8,
  });
```

## 性能优化

### 1. 避免频繁更新

```javascript
// ❌ 不好的做法：频繁重新映射
data.forEach((item) => {
  layer.color('value', colors);
  scene.render();
});

// ✅ 好的做法：批量更新
layer.color('value', colors);
scene.render();
```

### 简化映射逻辑

```javascript
// ❌ 复杂的回调函数会影响性能
layer.color((d) => {
  // 大量计算...
  return complexCalculation(d);
});

// ✅ 预处理数据，使用 scale 配置
data.forEach((d) => (d.colorCategory = complexCalculation(d)));
layer.scale('colorCategory', { type: 'cat' }).color('colorCategory', colors);
```

### 3. 使用合适的 Scale 类型

```javascript
// 大数据量时，quantize 比 quantile 快（不需要排序数据）
layer
  .scale('value', {
    type: 'quantize',
    domain: [0, 100],
  })
  .color('value', colorScale);
```

## 注意事项

⚠️ **数据范围**：确保映射字段在数据中存在且值有效

⚠️ **颜色数量**：色阶颜色数量建议 5-10 个，过多难以区分

⚠️ **可访问性**：考虑色盲友好的配色方案，避免红绿搭配

⚠️ **数据类型**：连续数据用渐变色，分类数据用区分色

⚠️ **Scale 类型**：根据数据分布选择合适的 scale 类型

⚠️ **默认值**：回调函数要处理空值情况，返回默认颜色

## 常见问题

### Q: 为什么颜色没有显示？

A: 检查：1) 字段名是否正确；2) 数据中是否有该字段；3) 颜色数组是否有效

### Q: 如何实现数据驱动的透明度？

A: 在 `style()` 中使用回调函数：

```javascript
layer.style({
  opacity: (feature) => feature.value / 100,
});
```

### Q: 映射后颜色分布不均匀？

A: 尝试不同的 scale 类型：

```javascript
// 使用 quantile 而不是 linear
layer.scale('value', { type: 'quantile' }).color('value', colors);

// 或手动指定 domain 范围
layer
  .scale('value', {
    type: 'linear',
    domain: [0, 1000], // 明确数据范围
  })
  .color('value', colors);
```

### Q: 如何自定义图例？

A: 参考 [components.md](../05-interaction/components.md) 中的图例组件

### Q: 能否同时映射多个字段到一个属性？

A: 使用回调函数自定义逻辑：

```javascript
layer.color((d) => {
  if (d.type === 'A' && d.value > 100) return 'red';
  if (d.type === 'B') return 'blue';
  return 'gray';
});
```

## 相关技能

- [样式配置](./style.md)
- [点图层](../03-layers/point-layer.md)
- [线图层](../03-layers/line-layer.md)
- [面图层](../03-layers/polygon-layer.md)
- [组件](../05-interaction/components.md)

## 在线示例

查看更多示例: [L7 官方示例 - 数据映射](https://l7.antv.antgroup.com/examples)
