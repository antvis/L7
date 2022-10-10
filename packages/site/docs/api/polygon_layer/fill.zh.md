---
title: 填充图
order: 1
---

`markdown:docs/common/style.md`

## 使用

```javascript
import { PolygonLayer } from '@antv/l7';
const layer = new PolygonLayer();
```

### shape

绘制填充图，shape 为`fill` 常量不支持数据映射

```javascript
layer.shape('fill');
```

### size

填充图无 size 不需要设置 size

### style

- opacityLinear 设置几何填充图的径向渐变

```javascript
style({
  opacityLinear: {
    enable: true, // true - false
    dir: 'in', // in - out
  },
});
```

[径向渐变 in](../../../examples/polygon/fill#china_linear_in)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*XjT5T4cT_CYAAAAAAAAAAAAAARQnAQ">

[径向渐变 out](../../../examples/polygon/fill#china_linear_out)

<img width="60%" style="display: block;margin: 0 auto;" alt="面图层填充图" src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Ob62Q7JDpZ4AAAAAAAAAAAAAARQnAQ">

- raisingHeight 设置 3D 填充图的抬升高度
