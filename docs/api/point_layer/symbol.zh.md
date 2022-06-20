---
title: 符号图
order: 4
---

`markdown:docs/common/style.md`

在地理区域上放置不同图片作为符号，通常表示不同地理要素分布情况

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>

## 使用

符号图 通过 PointLayer 对象实例化，将 shape 设置成图片符号

### shape

通过 scene addImage 方法

addImage()
参数：

- id 图片的 id,
- url 图片的 url

```javascript
scene.addImage(
  '00',
  'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
);
```

⚠️ 符号图的 ID 不能与点图层已有 shape 名称相同，比如不能设置 circle

符号图需要把 shape 设置成图片的 id，同样符号图 shape 也支持数据映射

```javascript
const scatter = new PointLayer()
  .source(data)
  .shape('00')
  .size(5)
  .color('red')
  .style({
    opacity: 0.3,
    strokeWidth: 1,
  });
```

🌟 为了得到更好的现实效果（图片清晰，无明显锯齿），我们在选择图片以及设置图标大小的时候应保持相当，或者在 L7 图层中设置的图标大小略小于实际图片的像素大小。

[在线案例](../../../examples/point/image#image)

### fillImage

🌟 默认通过 PointLayer 实例化的 image 本质上是精灵贴图，因此有始终面向相机的特性，同时贴图的大小也收到设备的限制。  
🌟 由于精灵始终面向相机，因此我们也无法自定义配置 image 的旋转角度

为了解决上述的两个问题（1. 大小受限，2. 无法自定义旋转角度），我们单独提供了 fillimage 的模式。  
只需要在初始化图层的时候提前指定 layerType 为 fillImage，其他使用与普通的 image 完全相同。

```javascript
const imageLayer = new PointLayer()
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
    layerType: 'fillImage',
  })
  .active({
    color: '#0ff',
    mix: 0.5,
  })
  .size(45);
scene.addLayer(imageLayer);

let r = 0;
rotate();
function rotate() {
  r += 0.2;
  imageLayer.style({
    rotation: r,
  });
  scene.render();
  requestAnimationFrame(rotate);
}
```

- rotation: number|undefined  
  我们支持使用 rotation 自定义配置图标的旋转角度（顺时针方向、角度制）

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*1kBZTaains4AAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/point/image#fillimage)

- rotate 方法
  符号图的 fillimage 模式支持 rotate 方法根据数据映射旋转角度。
  🌟 记得要把 style 中的 rotation 设为 0

```javascript
const imageLayer = new PointLayer()
  .source(data)
  .shape('wind', (wind) => {
    if (wind === 'up') {
      return 'arrBlue';
    }
    return 'arrRed';
  })
  .rotate('r', (r) => Math.PI * r)
  .size(15)
  .style({
    rotation: 0,
    layerType: 'fillImage',
  });
scene.addLayer(imageLayer);
```

[在线案例](/zh/examples/point/image#monsoon)
