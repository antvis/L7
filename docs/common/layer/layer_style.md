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

- 样式数据映射
  在大多数情况下，用户需要将 source 中传入的数据映射到图层的元素中，以此来达到需要的可视化的效果，比如想要用柱形图表示各地的人口数据，代码可能是这个样子的：

```javascript
const population = await getPopulation();
const layer = new PointLayer()
  .source(population)
  .shape('cylinder')
  .color('#f00')
  .size('population'); // population 字段表示数据中的人口值
scene.addLayer(layer);
```

而在一些特殊的业务场景下，我们可能需要将除了 size、color、以外的属性根据数据动态设置，如我们在绘制文本标注的时候需要根据文本的长短来设置偏移量，以保证文本位置的相对固定。在这种情况下，我们就需要使用图层样式数据纹理来完成这一项工作。

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*LPoeTJ5tPxMAAAAAAAAAAAAAARQnAQ'>

```javascript
const pointLayer = new PointLayer({})
  .source(data, {
    parser: {
      type: 'json',
      x: 'j',
      y: 'w',
    },
  })
  .shape('m', 'text')
  .size(12)
  .color('w', ['#0e0030', '#0e0030', '#0e0030'])
  .style({
    textAnchor: 'center', // 文本相对锚点的位置 center|left|right|top|bottom|top-left
    textOffset: 'textOffset', // 文本相对锚点的偏移量 [水平, 垂直]
    fontFamily,
    iconfont: true,
    textAllowOverlap: true,
  });
```

[在线案例](../../examples/point/text#styleMap)

从 L7 2.5 开始，各图层样式将逐步支持样式数据映射

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

<img width="60%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*F_QoSr-W0BwAAAAAAAAAAAAAARQnAQ'>

[在线案例](../../examples/point/scatter#scatterStyleMap)