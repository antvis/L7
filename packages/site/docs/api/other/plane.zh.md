---
title: PlaneGeometry
order: 0
---

<embed src="@/docs/common/style.md"></embed>

## 简介

PlaneGeometry 是 L7 提供的通用的平面几何体图形，表现为可以自定义为位置，大小和分段数的贴地矩形。

### demo

设置普通矩形

```javascript
import { Scene, GeometryLayer } from '@antv/l7';

const layer = new GeometryLayer()
  .shape('plane')
  .style({
    opacity: 0.8,
    width: 0.074,
    height: 0.061,
    center: [120.1025, 30.2594],
  })
  .active(true)
  .color('#ff0');
scene.addLayer(layer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*7DpqRrE0LM4AAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/geometry/geometry#plane)

设置 3D 地形模式

```javascript
import { Scene, GeometryLayer } from '@antv/l7';

const layer = new GeometryLayer().shape('plane').style({
  width: 0.074,
  height: 0.061,
  center: [120.1025, 30.2594],
  widthSegments: 200,
  heightSegments: 200,
  terrainClipHeight: 1,
  mapTexture:
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
  terrainTexture:
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ',
  rgb2height: (r, g, b) => {
    let h =
      -10000.0 +
      (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) * 0.1;
    h = h / 20 - 127600;
    h = Math.max(0, h);
    return h;
  },
});
scene.addLayer(layer);
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mkPtQJVN8eQAAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/geometry/geometry#terrain)

### source

🌟 PlaneGeometry 不需要设置 source，我们在 style 中通过 center 赋予其位置信息。

### style

PlaneGeometry 主要通过 style 方法设置位置、大小以及其他属性。

#### center: [lng: number, lat: number]

设置 PlaneGeometry 的位置，定位是 PlaneGeometry 的几何中心。PlaneGeometry 贴地放置。

#### width: number

设置 PlaneGeometry 的宽度，单位是经度。

#### height: number

设置 PlaneGeometry 的高度，单位是纬度。

#### widthSegments: number

设置 PlaneGeometry 在 纬度方向上的分段数。

#### heightSegments: number

设置 PlaneGeometry 在 经度方向上的分段数。

#### mapTexture: string

PlaneGeometry 纹理贴图 URL。

#### terrainTexture: string

PlaneGeometry 高度贴图 URL，当存在该参数的时候 L7 会自动解析高程信息。

#### terrainClipHeight: number

指定 3D 地形的裁剪高度。在一些情况下我们可能只需要保留存在丘陵山地的部分，通过这个参数我们可以指定地形高度低于这个参数值的部分不显示.

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*-SpgT6R05bcAAAAAAAAAAAAAARQnAQ'>

#### rgb2height: (r: number, g: number, b: number) => number

这是一个回调函数，参数是 L7 解析出的地形贴图的 rgb 信息，用户可以使用该函数定义高度值的计算逻辑（不同的地形贴图计算逻辑不同）。

🌟 widthSegments/heightSegments 指定 planeGeometry 的分段数，分段越多，地形越平滑，同时性能消耗越大。
