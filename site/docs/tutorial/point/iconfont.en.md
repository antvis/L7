---
title: iconfont
order: 7
---

<embed src="@/docs/api/common/style.md"></embed>

In addition to supporting drawing text annotations, the point layer also supports drawing and building simple icons by drawing text, that is, drawing`iconfont`. Through simple icons drawn with text, we can`color`Method to directly modify the color.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*WdOfSI_uyxIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### accomplish

Below we will introduce how to draw a simple`iconfont`Icon point layer.

- you can`L7`Found on the official website[Online case](/examples/point/text#iconfont)

```javascript
// Specify iconfont to be mapped to the name of the font style
const fontFamily = 'iconfont';
//Specify iconfont font file
const fontPath = '//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
//Add resources globally
scene.addFontFace(fontFamily, fontPath);
// Add the mapping of the iconfont field globally
scene.addIconFont('icon1', '');
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/bmw-prod/70408903-80db-4278-a318-461604acb2df.json')
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
        .shape('icon', 'text') //Specify that the field to be mapped is icon, and the shape type is the same as ordinary text annotation, which is text.
        .size(20)
        .color('w', ['#a6cee3', '#1f78b4', '#b2df8a', '#33a02c', '#fb9a99'])
        .style({
          textAnchor: 'center', // The position of the text relative to the anchor point center|left|right|top|bottom|top-left
          textOffset: [40, 0], // Offset of text relative to anchor point [horizontal, vertical]
          padding: [0, 0], // Text bounding box padding [horizontal, vertical], affects the collision detection results and prevents adjacent texts from being too close
          stroke: '#ffffff', // stroke color
          fontFamily,
          iconfont: true, // Enable iconfont mapping
        });
      scene.addLayer(pointLayer);
    });
});
```

1. `iconfont`Drawn is`unicode`Icon, you need to specify the corresponding icon in advance when using it`unicode`mapping file.
2. about`iconfont`Resource usage can go to`iconfont`Official website[Official website portal](https://iconfont.cn/)。

### shape(field: string, shapeType: 'text'): ILayer

`iconfont`In fact, it is a special text annotation, so`shape`The usage is consistent with the usage of ordinary text annotation.

- `field`Labeled field name.
- `shapeType`The default is`text`。

```javascript
layer.shape('iconfontField', 'text');
```

### style

we are using`iconfont`When drawing simple icons, you need to`style`method lieutenant general`iconfont`The parameters are set to`true`。

✨ iconfont The use of other style parameters is consistent with the parameters of ordinary text annotations.
