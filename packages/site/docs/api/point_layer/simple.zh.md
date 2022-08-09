---
title: 简单点
order: 3
---

`markdown:docs/common/style.md`

亮度图又称点密度图，单位面积的内点的个数越多，亮度会越亮，亮度图一般用来表达海量点数据分布情况

## 使用

气泡图通过 PointLayer 对象实例化，

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dVFmQIKh5TUAAAAAAAAAAAAAARQnAQ'>

### shape

- 简单点图层使用的 shape 参数是 simple

### use

- 简单点图层的使用和一般的点图层表现一致

- 简单点图层的实质是精灵贴图，因此简单点图层始终面向相机（普通的 2D 点图层保持面向上）

- 🌟 当用户对点图层的朝向没有要求或是对点图层的可视化效果要求比较简单，那么推荐尽量使用简单点图层，可以节省大量性能

- 🌟 简单点图层由于实质是精灵贴图，因此有大小限制：一般是 [1, 64]，不同设备之间存在差异

```javascript
// L7 提供了查询方法快速查看

scene.getPointSizeRange(); // Float32Array - [min, max]
```

[在线案例](../../../examples/point/dot#normal2)
