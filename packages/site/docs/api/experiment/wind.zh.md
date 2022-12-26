---
title: 风场图层
order: 7
---

`WindLayer` 用于将存储风场信息的图片，设置其风速线采样相关参数，将采样后的风场线的走向、强度通过可视化的方式在地图上呈现出来。

## 使用

```jsx
import { WindLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*ADr-SIxhM9AAAAAAAAAAAAAAARQnAQ' />

### source

(data, options) => WindLayer, 设置风场相关信息的函数

- data: string 存储风场信息的图片地址
  🌟 [数据获取](https://github.com/mapbox/webgl-wind#downloading-weather-data)
- options:

```js
{
  parser: {
    type: 'image',
      extent: [-180, -85, 180, 85],  // 用于设置风场图片作用到地图上的经纬图区间
  },
}
```

### animate

开启动画效果。

```javascript
layer.animate(true);
```

### style

- `uMin`: 风速 `X` 轴/横向最小值。
- `uMax`: 风速 `X` 轴/横向最大值。
- `vMin`: 风速 `Y` 轴/纵向最小值。
- `vMax`: 风速 `Y` 轴/纵向最大值。
- `sizeScale`: 风场线条粗细缩放比，`0 - 2`。
- `fadeOpacity`: 线条透明度，`0 - 1`。
- `numParticles`: 线条数量。
- `rampColors`: 线条填充颜色映射。

```js
const rampColors = {
  0.0: '#c6dbef',
  0.1: '#9ecae1',
  0.2: '#6baed6',
  0.3: '#4292c6',
  0.4: '#2171b5',
  0.5: '#084594',
};
```

[在线案例](/examples/wind/basic#wind)
