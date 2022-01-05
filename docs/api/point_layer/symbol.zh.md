---
title: 符号图
order: 4
---

`markdown:docs/common/style.md`

在地理区域上放置不同图片作为符号，通常表示不同地理要素分布情况

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*oVyHT5S3sv0AAAAAAAAAAABkARQnAQ'>

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

`markdown:docs/common/layer/base.md`
