---
title: Shape
order: 3
---

<embed src="@/docs/common/style.md"></embed>

`shape` 方法用于指定热力图层绘制热力的类型，现在支持经典热力、蜂窝热力、网格热力三种类型。

### shape('heatmap')

`shape` 为 `heatmap` 热力图层用于绘制 2D 经典热力。

### shape('heatmap3D')

`shape` 为 `heatmap3D` 热力图层用于绘制 3D 热力。

### transforms

网格热力和蜂窝热力的实现依赖配置 `transforms` 的参数，[具体说明使用](/api/source/source/#transforms)。

```js
fetch(
  'https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json',
)
  .then((res) => res.json())
  .then((data) => {
    const layer = new HeatmapLayer({})
      .source(data, {
        transforms: [
          {
            type: 'hexagon',
            size: 100,
            field: 'h12',
            method: 'sum',
          },
        ],
      })
      .size('sum', [0, 600])
      .shape('hexagonColumn')
      .style({
        coverage: 0.8,
        angle: 0,
      })
      .color(
        'sum',
        [
          '#094D4A',
          '#146968',
          '#1D7F7E',
          '#289899',
          '#34B6B7',
          '#4AC5AF',
          '#5FD3A6',
          '#7BE39E',
          '#A1EDB8',
          '#CEF8D6',
        ].reverse(),
      );
    scene.addLayer(layer);
  });
```
