### style

style 方法通常用于描述图层具体的样式，大多数图层会支持一些比较通用的属性， 如 opacity 属性，同时每个图层也会有仅限本图层支持的属性，如只有
CityBuildingLayer 支持的 windowColor 属性，每个图层具体要如何配置属性请查看每个图层的详细文档。

- opacity 设置透明度 大部分图层都支持

- stroke 线填充颜色 仅点图层支持

- strokeWidth 线的宽度 仅点图层支持

```javascript
layer.style({
  opacity: 0.8,
  stroke: 'white',
});
```

- 样式数据映射🌟<br />
  在正常情况下，style 的参数会作用到一个图层上的所有图形，如一个 PointLayer 中有十个点，我们设置 opacity = 0.5， 这样十个点的透明度都是 0.5。<br />
  而在特殊情况下，我们可能需要为每个点分别设置一个透明度，这时候按照原来的方式直接设置 style 方法的 opacity 的值就无法满足需求了，为此我们需要提供特殊的赋值方式。<br />
  通常我们会根据传入图层的数据为图层的每个图形设置单独的值，因此我们称之为“样式数据映射”。<br />
  我们支持几种设置 style 中的参数从 source 数据中动态取值的写法。

```javascript
// 根据数据中的 v 字段的值设置点图层各个点的透明度
const data = [
  {
    lng: 120,
    lat: 30,
    v: 0.5
  },
  ...
]
const layer = new PointLayer()
  .source(data, {
    parser: {
      x: 'lng',
      y: 'lat'
    }
  })
  .shape('circle')
  .color('#f00')
  .size({
    // 第一种写法 根据字段从 data 中直接取值
    opacity: 'v'// opacity = 0.5
  });
scene.addLayer(layer);
```

[在线案例](/zh/examples/point/text/style-map/)

从 `L7 2.5` 开始，各图层样式将逐步支持样式数据映射，目前支持样式数据映射的 `style` 参数如下：

| layer 类型/shape       | 支持的样式字段                                       | 备注                              |
| ---------------------- | ---------------------------------------------------- | --------------------------------- |
| pointLayer/fill        | opacity、strokeOpacity、strokeWidth、stroke、offsets | shape circle、triangle...         |
| pointLayer/image       | opacity、offsets                                     | offsets 经纬度偏移                |
| pointLayer/normal      | opacity、offsets                                     |                                   |
| pointLayer/text        | opacity、strokeWidth、stroke、textOffset             | textOffset 相对文字画布位置的偏移 |
| pointLayer/extrude     | opacity                                              |                                   |
| polygonLayer/fill      | opacity                                              |                                   |
| polygonLayer/extrude   | opacity                                              |                                   |
| lineLayer/line         | opacity                                              |                                   |
| lineLayer/arc          | opacity、thetaOffset                                 | thetaOffset 弧线的弯曲弧度        |
| lineLayer/arc3d        | opacity                                              |                                   |
| lineLayer/great_circle | opacity                                              |                                   |

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*iz3ERZdg2SkAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/point/scatter/scatter-style-map/)
