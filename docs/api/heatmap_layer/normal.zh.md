---
title: 经典热力图
order: 1
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

  - colors  颜色数组
  - positions 数据区间

  ⚠️ color, position 的长度要相同

## 完整代码

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

[在线案例](../../../examples/heatmap/heatmap#heatmap)

`markdown:docs/common/layer/base.md`
