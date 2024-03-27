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
  colors: ['#3288bd', '#66c2a5', '#abdda4', '#e6f598', '#fee08b', '#fdae61', '#f46d43', '#d53e4f'],
  positions: [0.0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 1.0],
};
```

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

[在线案例](/examples/wind/basic#wind)
