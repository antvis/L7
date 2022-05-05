---
title: SpriteGeometry
order: 1
---

`markdown:docs/common/style.md`

## 简介

SpriteGeometry 是 L7 提供的通用的粒子图层，可以用来绘制各种粒子效果。

### 基本用法

设置普通的粒子图层。

```javascript
import { Scene, GeometryLayer } from '@antv/l7';

let layer = new GeometryLayer()
  .shape('sprite')
  .size(10)
  .style({
    opacity: 0.3,
    center: [120, 30],
    spriteCount: 120,
    spriteRadius: 10,
    spriteTop: 2500000,
    spriteUpdate: 20000,
    spriteScale: 0.6,
  });
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PEd7RasIpiEAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/geometry/geometry#snow)

### source

🌟 SpriteGeometry 不需要设置 source，我们在 style 中通过 center 赋予其位置信息。

### style

SpriteGeometry 主要通过 style 方法设置位置、大小以及其他属性。

#### center: [lng: number, lat: number]

设置 SpriteGeometry 的位置，定位是 SpriteGeometry 的中心。

#### mapTexture: string

设置精灵的纹理贴图。

#### spriteRadius: number

粒子的作用半径，默认为 10。  
🌟 单个粒子会在图层位置半径范围内随机分布。

#### spriteAnimate: string

粒子的运动、默认为 'down'，表示向下运动。可选值有 'down'/'up'。

#### spriteCount: number

图层生成的粒子数量，默认为 100。

#### spriteTop: number

粒子运动的高度范围，默认为 5000000.  
🌟 需要注意的是，在不同的地图底图下，spriteTop/spriteUpdate 的参数值需要进行调整，才能得到较好的效果。默认值是在高德 1.0 的地图上调整的。

#### spriteUpdate: number

粒子运动刷新的步长，表现为运动速度、默认为 10000。  
🌟 需要注意的是，在不同的地图底图下，spriteTop/spriteUpdate 的参数值需要进行调整，才能得到较好的效果。默认值是在高德 1.0 的地图上调整的。

#### spriteScale: number

粒子大小缩放、默认为 1。

`markdown:docs/common/layer/base.md`
