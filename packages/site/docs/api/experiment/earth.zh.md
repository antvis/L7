---
title: Earth Mode
order: 1
---

<embed src="@/docs/common/style.md"></embed>

## 简介

l7-maps 提供 `Earth` 地图，相较于高德地图、mapbox 地图，是完全不同的一种表现形式，提供了全球视角下的可视化展示能力，为用户提供了更多的地理信息可视化表现形式。

✨ 为了区别普通的地图，l7-maps 提供了全新的 `Earth` 地图类型， L7 提供对应的 `EarthLayer` 图层

```js
import { EarthLayer } from '@antv/l7';
import { Earth } from '@antv/l7-maps';
```

## 目前在地球模式下支持的图层类型

### 点图层

**平面点: circle**

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PD6fTbs7E3gAAAAAAAAAAAAAARQnAQ'>

**圆柱点: cylinder**

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*n6tYQKceveUAAAAAAAAAAAAAARQnAQ'>

### 线图层

**3D 弧线: arc3d**

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FjhGT77aCaIAAAAAAAAAAAAAARQnAQ'>

## 使用

```javascript
// 1、引入对应模块
import { Scene, Earth } from '@antv/l7-maps';
import { EarthLayer } from '@antv/l7-layers';

// 2、构建 Earth Map
const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});

// 3、构建地球图层，当前的 shape 为 base，表示基础球体
const earthlayer = new EarthLayer()
  .source(
    // 地球表面的纹理
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image',
        extent: [121.168, 30.2828, 121.384, 30.421],
      },
    },
  )
  .color('#f00')
  .shape('base')
  .style({
    opacity: 1.0,
    radius: 40,
    globalOptions: {
      ambientRatio: 0.6, // 环境光
      diffuseRatio: 0.4, // 漫反射
      specularRatio: 0.1, // 高光反射
      earthTime: 0.1,
    },
  })
  .animate(true);

scene.on('loaded', () => {
  // 4、添加基础地球球体
  scene.addLayer(earthlayer);
});
// 经过上述的步骤，我们就可以在场景中添加一个基础的地球了
```

## 独立的地图类型 Earth

### 构造函数 Earth

作为 l7-maps 的基础地图类型，`Earth` 提供了地球系统的相机系统，目前只需要传入一个空对象。

- args: **{}**

```js
import { Scene, Earth } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});
```

### rotateY

提供了简单的方法控制地球系统的旋转（实际上控制的是相机的旋转，需要传入一个对象

- force: `false` 判断是否强制生效，默认该方法的优先级比用户鼠标操作要低，当用户操作相机的时候，该方法会失效
- reg: `0.01` 旋转的角度（视觉上地球的旋转角度）， `reg` 表示的并不是实际的旋转角度，而是单位旋转角度的比例  
  🌟 单位旋转角度 = Math.min(this.earthCameraZoom \* this.earthCameraZoom, 1)

```js
import { Scene, Earth } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Earth({}),
});

function step() {
  scene.map.rotateY({
    option: {
      force: true,
      reg: 0.1,
    },
  });
  requestAnimationFrame(step);
}

scene.on('loaded', () => {
  scene.addLayer(earthlayer);
  step();
});
```

## 地图图层 EarthLayer

地球图层区别于普通高德地图和 Mapbox 地图的图层，只在地球模式下可以被使用，用于表示地球的球体、大气层、辉光等效果。  
🌟 使用不同的 `shape` 参数表示区别不同的地球图层。

### 地球球体图层 baseLayer

- source: 数据

  - map: 地球表面纹理贴图的地址
  - parser: 解析器，目前只需要写固定的对象值即可: `{ parser: { type: "image" } }`

- shape: 图层类型

  默认值是 `base`, 目前支持的 `shape` 类型有:

  - base: 球体
  - atomSphere: 大气层
  - bloomSphere: 辉光

  当用户的 `shape` 参数不被识别时，自动降级为 `base` 类型

- globalOptions: 图层样式
  - ambientRatio: 环境光
  - diffuseRatio: 漫反射
  - specularRatio: 高光反射

```javascript
const earthlayer = new EarthLayer()
  .source(
    'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
    {
      parser: {
        type: 'image',
      },
    },
  )
  .shape('base')
  .style({
    globalOptions: {
      ambientRatio: 0.6, // 环境光
      diffuseRatio: 0.4, // 漫反射
      specularRatio: 0.1, // 高光反射
    },
  });
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*i_TBRZRLSuYAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7 地球图层" width="450px">

### 地球内发光/大气图层 atomLayer

`atomLayer` 作为地球的效果图层，不需要传入数据，所以可以不调用 `source` 方法

```javascript
const atomLayer = new EarthLayer()
  .color('#2E8AE6')
  .shape('atomSphere')
  .style({
    // 可以控制发光程度
    opacity: 1,
  });
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1MU_RZQyFTkAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7 地球图层大气效果" width="450px" >

### 地球内外发光/辉光图层 bloomLayer

`bloomLayer` 作为地球的效果图层，不需要传入数据，所以可以不调用 `source` 方法

```javascript
const bloomLayer = new EarthLayer()
  .color('#fff')
  .shape('bloomSphere')
  .style({
    opacity: 0.5,
  });
```

<img src="https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FTniTZOZkNUAAAAAAAAAAAAAARQnAQ" style="display: block; margin: 0 auto" alt="L7 地球图层辉光效果" width="450px" >
