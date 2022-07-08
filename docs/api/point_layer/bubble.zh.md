---
title: 气泡图
order: 1
---

`markdown:docs/common/style.md`

气泡图地理区域上方会显示不同大小的圆点，圆形面积与其在数据集中的数值会成正比。

## 使用

气泡图通过 PointLayer 对象实例化，

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*fNGiS7YI1tIAAAAAAAAAAABkARQnAQ'>

### shape

通常气泡图 shape 设置为 **circle**

### size

气泡图大小，需要指定数据映射字段

```javascript
const bubble = new PointLayer()
  .source(data)
  .shape(circle)
  .size('mag', [0, 25])
  .color('red')
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

### animate

气泡图支持水波动画效果

#### 开启关闭动画

```javascript
layer.animate(true);
layer.animate(false);
```

#### 水波配置项

- speed 水波速度
- rings 水波环数

[在线案例](../../../examples/point/bubble#point)
