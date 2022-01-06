---
title: 亮度图
order: 3
---

`markdown:docs/common/style.md`

亮度图又称点密度图，单位面积的内点的个数越多，亮度会越亮，亮度图一般用来表达海量点数据分布情况

## 使用

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*xr8BQouXGvoAAAAAAAAAAABkARQnAQ'>

### shape

- dot 如果需要使用亮度图可以将 shape 设置为 dot,或者不设置 shape

### color

- 无权重
  如果数据没有权重可以将颜色设置为常量，渲染时会自动进行颜色叠加，点越多颜色越亮
- 有权重
  如果数据有权重可以设置一组同一色相，不同亮度的色带，值越大亮度会越亮。

```javascript
const pointLayer = new PointLayer()
  .source(data)
  .size(2)
  .shape('dot')
  .color('h8', [
    '#0A3663',
    '#1558AC',
    '#3771D9',
    '#4D89E5',
    '#64A5D3',
    '#72BED6',
    '#83CED6',
    '#A6E1E0',
    '#B8EFE2',
    '#D7F9F0',
  ])
  .style({
    opacity: 1,
  });

scene.addLayer(pointLayer);
```

[在线案例](../../../examples/point/dot#normal2)

`markdown:docs/common/layer/base.md`
