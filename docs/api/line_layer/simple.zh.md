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

🌟 目前渐变色的方向为垂直向上

`markdown:docs/api/line_layer/features/animate.zh.md`

`markdown:docs/api/line_layer/features/texture.zh.md`

🌟 地理围栏支持了新的样式参数 iconStepCount

- 纹理间隔只有在开启纹理的时候才会生效
- 纹理间隔支持配置纹理之间的间距
- 纹理间隔需要和纹理间距配合使用

```javascript
.style({
  lineTexture: true, // 开启线的贴图功能
  iconStep: 40, // 设置贴图纹理的间距
  iconStepCount: 4
})
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*3f8ORIbjJmkAAAAAAAAAAAAAARQnAQ'>

### heightfixed

wall 支持了固定高度配置 heightfixed

```javascript
 .style({
     heightfixed: true // 默认为 false，开启后实际世界高度不变（注意调整尺寸）
 })
```

`markdown:docs/common/layer/base.md`
