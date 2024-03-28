---
title: 符号图
order: 5
---

<embed src="@/docs/api/common/style.md"></embed>

点图层支持绘制图标，在地理区域上放置不同图片作为符号，通常表示不同地理要素分布情况

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的符号地图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/image/#image)

```javascript
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'light',
    center: [121.434765, 31.256735],
    zoom: 14.83,
  }),
});
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
);
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
);
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json')
    .then((res) => res.json())
    .then((data) => {
      const imageLayer = new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        .shape('name', ['00', '01', '02'])
        .size(25);
      scene.addLayer(imageLayer);
    });
});
```

### addImage(field: string, url: string): void

为了使用点图层绘制图标，我们需要事先在 `scene` 全局添加对应的图片资源。之后我们就可以在点图层的 `shape` 方法中指定对应的图片。

```js
scene.addImage(
  '02',
  'https://gw.alipayobjects.com/zos/basement_prod/7aa1f460-9f9f-499f-afdf-13424aa26bbf.svg',
);
```

### shape

我们需要通过 `shape` 方法指定当前点图层需要加载的图片资源 `ID`，`ID` 是用户使用 `scene.addImage(id, url)` 全局添加图片资源时候的 `ID`，即符号图需要把 `shape` 设置成图片的 `id`。

```javascript
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
scene.addImage(
  '01',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);

layer.shape('00');
```

⚠️ 符号图的 `ID` 不能与点图层已有 shape 名称相同，比如不能设置 `circle`。

同样符号图 `shape` 也支持数据映射

```javascript
const scatter = new PointLayer()
  .source(data)
  .shape('name', (v) => {
    switch (v) {
      case 'p1':
        return '00';
      case 'p2':
        return '01';
    }
  })
  .size(5)
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

⚠️ 符号图不应该设置 `color` 传入颜色，`color` 设置的颜色会覆盖图片的颜色。

⚠️ 为了得到更好的现实效果（图片清晰，无明显锯齿），我们在选择图片以及设置图标大小的时候应保持相当，或者在 L7 图层中设置的图标大小略小于实际图片的像素大小。

[在线案例](/examples/point/image#image)

### style

#### billboard

1. 默认通过 `PointLayer` 实例化的 `image` 本质上是精灵贴图，因此有始终面向相机的特性，同时贴图的大小也收到设备的限制。
2. 由于精灵始终面向相机，因此我们也无法自定义配置 `image` 的旋转角度。

为了解决上述的两个问题（1. 大小受限，2. 无法自定义旋转角度），我们单独提供了非精灵模式`billboard` 的模式。

只需要在 style 中配置 billboard 为 `false`

```javascript
const imageLayer = new PointLayer({ layerType: 'fillImage' })
  .source(data, {
    parser: {
      type: 'json',
      x: 'longitude',
      y: 'latitude',
    },
  })
  .shape('name', ['00', '01', '02'])
  .style({
    rotation: 0,
    billboard: false,
  })
  .size(45);
```

##### rotation

我们支持使用 `rotation` 自定义配置图标的旋转角度（顺时针方向、角度制）。

- `rotation`: number|undefined // 角度单位 0-360

```ts
layer.style({
  rotation: 90,
});
```

rotation 支持常量，也支持数据映射

```ts
layer.style({
  rotation: {
    field: 'rotate',
    value: [0, 360],
  },
});
```

```tsx
layer.style({
  rotation: {
    field: 'rotate',
    value: (rotate) => {
      return rotate;
    },
  },
});
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1kBZTaains4AAAAAAAAAAAAAARQnAQ'>

[在线案例](/examples/point/image#fillimage)

符号图的 非 billboard 模式支持 `rotation` 方法根据数据映射旋转角度。

```javascript
const imageLayer = new PointLayer()
  .source(data)
  .shape('wind', (wind) => {
    if (wind === 'up') {
      return 'arrBlue';
    }
    return 'arrRed';
  })
  .size(15)
  .style({
    rotation: 0, //
    billboard: false,
  });
scene.addLayer(imageLayer);
```

[在线案例](/examples/point/image#monsoon)
