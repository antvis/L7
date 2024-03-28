---
title: Shape
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

`shape`The method is used to specify the type of heat drawn by the heat layer. Now it supports three types: classic heat, cellular heat, and grid heat.

### shape('heatmap')

`shape`for`heatmap`Heat layers are used to draw classic heat in 2D.

### shape('heatmap3D')

`shape`for`heatmap3D`Thermal layers are used to draw 3D heat.

### transforms

Implementation of Grid Thermal and Cellular Thermal depends on configuration`transforms`parameters,[Specific instructions for use](/api/source/source/#transforms)。

```js
fetch('https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json')
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
