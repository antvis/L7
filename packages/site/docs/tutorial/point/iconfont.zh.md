---
title: iconfont 标注
order: 7
---
<embed src="@/docs/common/style.md"></embed>

点图层除了支持绘制文字标注之外还支持通过绘制文字的方式绘制建简单的图标，即绘制 `iconfont`。通过文字方式绘制的简单图标，我们可以 `color` 方法直接修改颜色。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*WdOfSI_uyxIAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个简单的 `iconfont` 图标点图层。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/text#iconfont)

```javascript
// 指定 iconfont 映射为字体样式的名称
const fontFamily = 'iconfont';
// 指定 iconfont 字体文件
const fontPath ='//at.alicdn.com/t/font_2534097_fcae9o2mxbv.woff2?t=1622200439140';
// 全局添加资源
scene.addFontFace(fontFamily, fontPath);
// 全局添加 iconfont 字段的映射
scene.addIconFont('icon1', '&#xe6d4;');
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
        });
      scene.addLayer(pointLayer);
    });
});
```

1. `iconfont` 绘制的是 `unicode` 图标，在使用的时候需要提前指定对应的 `unicode` 映射文件。
2. 关于 `iconfont` 资源使用可以前往 `iconfont` 官网 [官网传送门](https://iconfont.cn/)。

### shape(field: string, shapeType: 'text'): ILayer

`iconfont` 其实就是特殊的文本标注，因此 `shape` 的用法和普通文本标注的用法保持一致。

- `field` 标注的字段名称。
- `shapeType` 默认为 `text`。

```javascript
layer.shape('iconfontField', 'text');
```

### style

我们在使用 `iconfont` 绘制简单图标的时候需要在 `style` 方法中将 `iconfont` 参数设置为 `true`。

✨ iconfont 其他 style 参数的使用和普通的文本标注的参数保持一致。
