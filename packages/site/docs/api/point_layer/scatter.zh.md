---
title: 散点图
order: 2
---

`markdown:docs/common/style.md`

在地理区域上放置相等大小的圆点，用来表示地域上的空间布局或数据分布。

## 使用

散点图通过 PointLayer 对象实例化

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*LnlmQ7sFWigAAAAAAAAAAABkARQnAQ'>

### shape

- circle
- square
- hexagon
- triangle
- pentagon
- octogon
- hexagram
- rhombus
- vesica

散点图 shape 一般设置成常量

### color

color 可以根据数据的差异设置成不同颜色，表示数据的不同分类。

### size

散点图一般等大小的图形，size 一般设置成常量。

```javascript
const scatter = new PointLayer()
  .source(data)
  .shape(circle)
  .size(5)
  .color('red')
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

[在线案例](/zh/examples/point/scatter#scatter)

### style

```javascript
layer.style({
  blur: 0.3,
});
```

散点图的 style 样式支持配置 blur，调整模糊。

[在线案例](/zh/examples/point/scatter#blur)
