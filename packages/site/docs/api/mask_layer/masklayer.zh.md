---
title: 图层掩膜
order: 0
---

<embed src="@/docs/common/style.md"></embed>

## 简介

⚠️ 原有 MaskLayer 功能受限，后续将废弃掉，现采用更灵活的 Mask 方案。

现有掩膜方案采用图层进行掩膜。

`MaskLayer` 是一类特殊的图层，和其他图层配合使用，用于对其他图层进行裁剪操作。`MaskLayer` 有两种用法，一种是在创建普通 `layer` 的时候配置 `mask` 参数，另外一种是直接创建 `MaskLayer` 图层添加到 `Scene` 中。在直接创建 `MaskLayer` 图层的时候，我们还可以创建瓦片类型的掩模图层。

<div>
  <div style="width:40%; margin: 16px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*QUb2TY71GjIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

```javascript
import { MaskLayer } from '@antv/l7';
let layer = new MaskLayer().source(data);

scene.addLayer(layer);

const layer2 = new PointLayer({
  mask: true,
  maskfence: ...
})
```

- 🌟 掩模图层本身没有 `color`、`size`、`shape` 等概念，存在只是为了支持对其他图层内容进行裁剪。
- 🌟 掩模图层可以理解为贴合地图水平面的透明几何体图层。
