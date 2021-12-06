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

## 额外的 style 配置

- opacityLinear 设置几何填充图的径向渐变

```javascript
style({
  opacityLinear: {
    enable: true, // true - false
    dir: 'in'     // in - out
  }
})
```
[径向渐变 in](../../../../examples/polygon/fill#china_linear_in)  
[径向渐变 out](../../../../examples/polygon/fill#china_linear_out)

`markdown:docs/common/layer/base.md`
