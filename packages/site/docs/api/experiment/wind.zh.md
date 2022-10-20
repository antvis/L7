---
title: 风场图层
order: 7
---

WindLayer 用于将存储风场信息的图片，设置其风速线采样相关参数，将采样后的风场线的走向、强度通过可视化的方式在地图上呈现出来。

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

开启动画效果

```javascript
layer.animate(true);
```

### style

- uMin: 风速 X 轴/横向最小值
- uMax: 风速 X 轴/横向最大值
- vMin: 风速 Y 轴/纵向最小值
- vMax: 风速 Y 轴/纵向最大值
- sizeScale: 风场线条粗细缩放比，0-2
- fadeOpacity: 线条透明度，0-1
- numParticles: 线条数量
- rampColors: 线条填充颜色映射，例：
  {
  0.0: '#3288bd',
  0.1: '#66c2a5',
  0.2: '#abdda4',
  0.3: '#e6f598',
  0.4: '#fee08b',
  0.5: '#fdae61',
  0.6: '#f46d43',
  1.0: '#d53e4f'
  }

#### rampColors

🌟 数据栅格瓦片

配置瓦片值域映射颜色的色带。

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

[在线案例](/zh/examples/wind/basic#wind)
