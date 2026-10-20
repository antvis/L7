---
title: "Style"
description: "Style"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/api/heatmap_layer/style/"
---

[资料索引](/llms.txt)

`style` 方法用于配制图层的样式，相同图层拥有不同的 `shape` 图形，不同 `shape` 的图层 `style` 方法接受不同的参数。

🌟 蜂窝热力图和网格热力图的 `style` 样式可以参考实际绘制的图层。

```js
layer.style({
  opacity: 0.5,
});
```

### common

通用 `style` 参数，所有图形都支持的参数。

| style   | 类型     | 描述         | 默认值 |
| ------- | -------- | ------------ | ------ |
| opacity | `number` | 图形的透明度 | `1`    |

### heatmap

`shape` 为 `heatmap`、`heatmap3D` 类型的时候，绘制经典热力图。

| style      | 类型     | 描述         | 默认值 |
| ---------- | -------- | ------------ | ------ |
| intensity  | `number` | 热力的强度   | `10`   |
| radius     | `number` | 热力点的半径 | `10`   |
| rampColors | `number` | 热力的色值   | `1`    |

#### rampColors

- colors  颜色数组
- positions 数据区间

配置值域映射颜色的色带，值域的范围为 `[0 - 1]`, 对应的我们需要为每一个 `position` 位置设置一个颜色值。

⚠️ colors, positions 的长度要相同

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

### hexagon

绘制蜂窝热力图。

| style    | 类型     | 描述         | 默认值 |
| -------- | -------- | ------------ | ------ |
| angle    | `number` | 图形旋转角度 | `0`    |
| coverage | `number` | 图形覆盖比率 | `0.9`  |

### grid

绘制网格热力图。

| style    | 类型     | 描述         | 默认值 |
| -------- | -------- | ------------ | ------ |
| coverage | `number` | 图形覆盖比率 | `1`    |
