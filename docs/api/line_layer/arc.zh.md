---
title: 弧线图
order: 2
---

`markdown:docs/common/style.md`

绘制弧线 通过贝塞尔曲线算法技术弧线

## 使用

```javascript
import { LineLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dUk8RbtjUDIAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../../examples/line/animate#wind)

### shape

shape 设置成 arc 即可

### 数据

绘制弧线只需提供起止点坐标即可（起止点调换位置，弧线的形状会对称相反，飞线动画的方向也会相反）

```javascript
source(data, {
  parser: {
    type: 'csv',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

`markdown:docs/api/line_layer/features/segmentNumber.zh.md`

`markdown:docs/api/line_layer/features/thetaOffset.zh.md`

`markdown:docs/api/line_layer/features/linear.zh.md`

`markdown:docs/api/line_layer/features/animate.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`

`markdown:docs/common/layer/base.md`
