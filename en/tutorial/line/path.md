---
title: "Path"
description: "Path"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/tutorial/line/path/"
---

[Resource index](/llms.txt)

We often need to draw common paths such as roads, action routes, water systems, etc. on the map. These drawn lines can be collectively called a path map, that is, a line layer positioned with a set of point coordinate pairs that are not closed at the beginning and end.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*KEupSZ_p0pYAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a common path diagram.

- you can`L7`Found on the official website[Online case](/en/examples/gallery/animate/animate-path-texture/)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.15, 30.246],
    zoom: 13.5,
    style: 'dark',
    rotation: -90,
  }),
});
scene.addImage(
  'arrow',
  'https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg',
);
fetch('https://gw.alipayobjects.com/os/basement_prod/40ef2173-df66-4154-a8c0-785e93a5f18e.json')
  .then((res) => res.json())
  .then((data) => {
    const layer = new LineLayer({})
      .source(data)
      .size(3)
      .shape('line')
      .texture('arrow')
      .color('rgb(22,119,255)')
      .animate({
        interval: 1, // interval
        duration: 1, // duration, delay
        trailLength: 2, // streamline length
      })
      .style({
        opacity: 0.6,
        lineTexture: true, // Enable line mapping function
        iconStep: 10, // Set the spacing of the texture
        borderWidth: 0.4, //The default value is 0, the maximum valid value is 0.5
        borderColor: '#fff', // Default is #ccc
      });
    scene.addLayer(layer);
  });
```

### shape

We generally refer to the path diagram as`shape`The parameters are set to`line`。

### size

For path diagrams, we generally only need to set a constant to represent the width of the path.

```javascript
layer.size(2); // Draw a path with width 2
```

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


#### dash

线图层通过在 style 中设置线的类型，同时指定虚线部分和实线部分

```javascript
const layer = new LineLayer({})
  .source(data)
  .size(1.5)
  .shape('line')
  .color('标准名称', ['#5B8FF9', '#5CCEA1', '#F6BD16'])
  .active(true)
  .style({
    lineType: 'dash',
    dashArray: [5, 5],
  });
scene.addLayer(layer);
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*pb3FRZnaa0AAAAAAAAAAAAAAARQnAQ'>

- lineType
  默认为 solid，表示实线，dash 表示虚线
- dashArray[len1: number, len2: number]
  len1 实线长度
  len2 间隔长度

[在线案例](/zh/examples/line/arc/trip-arc-dark-linear/)


#### border

线图层支持在 style 中设置边框的宽度和颜色

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
    borderWidth: 0.35, // 默认文 0，最大有效值为 0.5
    borderColor: '#888', // 默认为 #ccc
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PsbNRpboEKEAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/gallery/animate/animate-path-texture/)


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
