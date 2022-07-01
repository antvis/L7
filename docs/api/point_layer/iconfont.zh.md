---
title: iconfont 标注
order: 4
---

`markdown:docs/common/style.md`

可以认为 iconfont 标注就是特殊的文本标注，它允许用户以绘制文字的方式绘制简单的图标。

## 使用

iconfont 支持绘制 unicode 图标，在使用的时候需要提前指定对应的 unicode 映射文件。

```javascript
import { PointLayer } from '@antv/l7';
```

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*WdOfSI_uyxIAAAAAAAAAAAAAARQnAQ'>

```javascript
// 指定 iconfont 映射为字体样式的名称
const fontFamily = 'iconfont';

// 指定 iconfont 字体文件
const fontPath =
  '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';

// 全局添加资源
scene.addFontFace(fontFamily, fontPath);

// 全局添加 iconfont 字段的映射
scene.addIconFont('icon1', '&#xe6d4;');

scene.on('loaded', () => {
  fetch(
    'https://gw.alipayobjects.com/os/bmw-prod/70408903-80db-4278-a318-461604acb2df.json',
  )
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data.list, {
          parser: {
            type: 'json',
            x: 'j',
            y: 'w',
          },
        })
        .shape('icon', 'text') // 指定需要映射字段为 icon、shape 类型和普通的文字标注一样为 text
        .size(20)
        .color('w', ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'])
        .style({
          textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
          textOffset: [40, 0], // 文本相对锚点的偏移量 [水平, 垂直]
          padding: [0, 0], // 文本包围盒 padding [水平，垂直]，影响碰撞检测结果，避免相邻文本靠的太近
          stroke: '#ffffff', // 描边颜色
          fontFamily,
          iconfont: true, // 开启 iconfont 映射
          textAllowOverlap: true,
        });
      scene.addLayer(pointLayer);
    });
});
```

🌟 关于 iconfont 资源使用可以前往 iconfont 官网 [官网传送门](https://iconfont.cn/)

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*PMuES7vfcKEAAAAAAAAAAAAAARQnAQ'>

### shape

- field 标注的字段名称
- shapeType 'text'

```javascript
layer.shape('iconfontField', 'text');
```

🌟 iconfont 就是特殊的文本标注，也属于文本标注，所以在 shape 使用上和普通的文本标注保持一致。

### style

- iconfont `boolean` 需要设为 true （默认为 false）

✨ iconfont 其他 style 参数的使用和普通的文本标注的参数保持一致

[在线案例](../../../examples/point/text#iconfont)
