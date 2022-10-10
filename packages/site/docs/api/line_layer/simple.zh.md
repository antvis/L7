---
title: 简单线图层
order: 4
---

`markdown:docs/common/style.md`

简单线图层为用户提供了一种大数据量性能更优的选择，能轻松渲染有几十万个节点的线段，但相应的，对比与普通的线图层，简单线图层也丢失了一些其他能力。

## 使用

```javascript
import { LineLayer } from '@antv/l7';
const layer = new LineLayer()
  .source(data)
  .shape('simple')
  .size(10) // size 方法不生效 线宽始终为 1px
  .color('#f00')
  .style(...)

```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*HulgSKEJAKMAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../../examples/gallery/animate#grid)

### shape

shape 设置成 simple 即可

`markdown:docs/api/line_layer/features/linear.zh.md`

🌟 简单线图层不支持动画和纹理
