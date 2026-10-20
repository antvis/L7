---
title: "Wall"
description: "Wall"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/tutorial/line/wall/"
---

[Resource index](/llms.txt)

Geographic fencing gives the concept of height based on the original line layer, and other uses are consistent with ordinary line drawings.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mLfxTb4mI6AAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a simple geofence.

- you can`L7`Found on the official website[Online case](/en/examples/line/wall/hangzhou-wall/)

## use

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [119.297868, 29.732983],
    zoom: 7.11,
    rotation: 1.22,
    pitch: 45.42056074766357,
    style: 'dark',
  }),
});

scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/93a55259-328e-4e8b-8dc2-35e05844ed31.json')
    .then((res) => res.json())
    .then((data) => {
      const layer = new LineLayer({}).source(data).size(40).shape('wall').style({
        opacity: 1,
        sourceColor: '#0DCCFF',
        targetColor: 'rbga(255,255,255, 0)',
      });
      scene.addLayer(layer);
    });
});
```

### shape

In order to draw geofences we need to`shape`The parameters are set to`wall`。

### animate

#### 开启关闭动画

```javascript
layer.animate(true);
layer.animate(false);
```

#### 设置动画参数

- duration 动画时间 单位(s)秒
- interval 轨迹间隔, 取值区间 0 - 1
- trailLength 轨迹长度 取值区间 0 - 1

```javascript
layer.animate({
  duration: 4,
  interval: 0.2,
  trailLength: 0.1,
});
```

##### 参数动画介绍

L7 目前动画参数为相对单位，我们默认一条线段的长度为 1
![L7 动画参数](https://gw.alipayobjects.com/mdn/rms_855bab/afts/img/A*IBBfSIkb51cAAAAAAAAAAABkARQnAQ)

如果 interval = 0.2,则一条轨迹将会分成 5 段，如果 interval = 0.5 则为两段。

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*mo_7Q6sTqOIAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/line/animate/plane-animate2/)


### style

#### linearColor

线图层通过在 style 中设置起始颜色和终点颜色来设置颜色渐变，渐变色的优先级比 color 方法设置的颜色更高

```javascript
const layer = new LineLayer({})
  .source(data, {
    parser: {
      type: 'csv',
      x: 'lng1',
      y: 'lat1',
      x1: 'lng2',
      y1: 'lat2',
    },
  })
  .size(1)
  .shape('arc')
  .color('#8C1EB2')
  .style({
    sourceColor: '#f00', // 起点颜色
    targetColor: '#0f0', // 终点颜色
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*8DYQTZeQyZ4AAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/line/arc/trip-arc-dark-linear/)


🌟 The current gradient direction is vertically upward

线图层支持纹理贴图和多种表现形式，通过 `scene.addImage` 方法添加到全局的资源，使用 `texture` 方法指定贴图。

```javascript
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
);
const layer = new LineLayer()
  .source(data)
  .size(4)
  .shape('line')
  .texture('02')
  .color('#25d8b7')
  .animate({
    interval: 1, // 间隔
    duration: 1, // 持续时间，延时
    trailLength: 2, // 流线长度
  })
  .style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 20, // 设置贴图纹理的间距
  });
```

<div>
  <div style="width:40%;float:right; margin-left: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

- lineTexture 指定是否开启纹理贴图能力
- iconStep 指定贴图在线图层上面排布的间隔

[在线案例](/zh/examples/gallery/animate/animate-path-texture/)

#### texture advance

✨ animate<br />
当线图层 (`shape` 为 `arc`/`arc3d`) 开启动画模式的时候，纹理在线图层上的分布还会和 `animate` 的参数相关.

线图层上排列的纹理的数量大致为 duration/interval

```javascript
.animate({
    duration: 1,
    interval: 0.2,
    trailLength: 0.1
});

// 此时 纹理贴图数量为  duration / interval = 5
```

✨ textureBlend 参数<br />
通过控制 style 方法中的 textureBlend 参数，我们可以控制纹理图层和线图层的混合情况

- normal
- replace

```javascript
.style({
    lineTexture: true, // 开启线的贴图功能
    iconStep: 30, // 设置贴图纹理的间距
    textureBlend: 'replace', // 设置纹理混合方式，默认值为 normal，可选值有 normal/replace 两种
  });

```

[在线案例](zh/examples/line/animate#plane_animate2)


🌟 Geofence supports new style parameter iconStepCount

- Texture interval will only take effect when texture is turned on
- Texture spacing supports configuring the spacing between textures
- Texture spacing needs to be used in conjunction with texture spacing

```javascript
.style({
  lineTexture: true, // Enable line mapping function
  iconStep: 40, // Set the spacing of the texture
  iconStepCount: 4
})
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*3f8ORIbjJmkAAAAAAAAAAAAAARQnAQ'>

#### heightfixed

`wall`Fixed height configuration supported`heightfixed`。

```javascript
.style({
     heightfixed: true // The default is false. The actual world height does not change after it is turned on (note the size adjustment)
 })
```
