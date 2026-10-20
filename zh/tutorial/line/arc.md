---
title: "弧线图"
description: "弧线图"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/tutorial/line/arc/"
---

[资料索引](/llms.txt)

有时候为了可视化效果，会选择使用弧线连接地图上的两点。同时也可以使用弧线完成一些有趣的效果。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*dUk8RbtjUDIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何使用弧线绘制一个模拟的风场。

- 你可以在 `L7` 官网上找到[在线案例](/zh/examples/line/animate/animate-line/)

```javascript
import { Scene, LineLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [60, 40.7128],
    zoom: 2,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/7455fead-1dc0-458d-b91a-fb4cf99e701e.txt')
    .then((res) => res.text())
    .then((data) => {
      const layer = new LineLayer({ blend: 'normal' })
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
        .color('#6495ED')
        .animate({
          duration: 4,
          interval: 0.2,
          trailLength: 0.6,
        });
      scene.addLayer(layer);
    });
});
```

### source

绘制弧线需要同时提供起点和止点的坐标（起止点调换位置，弧线的形状会对称相反，飞线动画的方向也会相反）。

```javascript
const data = [
  {
    lng1: 120,
    lat1: 30,
    lng2: 130,
    lat2: 30,
  },
];
layer.source(data, {
  parser: {
    type: 'json',
    x: 'lng1',
    y: 'lat1',
    x1: 'lng2',
    y1: 'lat2',
  },
});
```

### shape

为了绘制弧线图，我们需要将 `shape` 的参数设置成 `arc`。

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

#### segmentNumber

arc 图层的弧线默认分段数是 30，然而有有些时候用户并不需要这么多的分段数，适当降低分段数量可以在保证效果的情况下提高性能。

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
    segmentNumber: 15,
  });
```


#### thetaOffset

thetaOffset 参数 表示 arc 弧线的弧度，默认值是 0.314

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
    thetaOffset: 0.35,
  });
```

<img width="450px" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*qRFaR7Ko274AAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/gallery/animate/animate-path-texture/)


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
