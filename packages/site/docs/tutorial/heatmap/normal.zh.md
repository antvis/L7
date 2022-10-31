---
title: 经典热力图
order: 0
---
`markdown:docs/common/style.md`

## 使用

```javascript
import { HeatmapLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*QstiQq4JBOIAAAAAAAAAAABkARQnAQ'>

### shape

常量 heatmap

```javascript
layer.shape('heatmap');
```

### size

- field: 热力图权重字段
- values: 数据映射区间 热力图显示 [0, 1] 效果最佳

```javascript
layer.size('weight', [0, 1]);
```

### color

heatmap 需要设置 color 方法，样式通过 style 设置

### style

- intensity    全局热力权重     推荐权重范围 1-5
- radius   热力半径，单位像素
- rampColors 色带参数

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

### demo

```javascript
heatmapLayer()
  .source(data)
  .size('mag', [0, 1]) // weight映射通道
  .style({
    intensity: 3,
    radius: 20,
    rampColors: {
      colors: [
        'rgba(33,102,172,0.0)',
        ...
      ],
      positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
    },
  });
```

[在线案例](/zh/examples/heatmap/heatmap#heatmap)
