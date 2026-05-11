---
title: Shape
order: 3
---

<embed src="@/docs/api/common/style.md"></embed>

`shape` 方法用于指定热力图层绘制热力的类型，支持经典热力、蜂窝热力、网格热力等多种类型。

```js
layer.shape('heatmap');
```

| shape 值         | 说明                               |
| ---------------- | ---------------------------------- |
| `heatmap`        | 2D 经典高斯热力图                  |
| `heatmap3D`      | 3D 热力图，在 Z 轴方向展示热力强度 |
| `hexagon`        | 六边形网格（2D 平面）              |
| `hexagonColumn`  | 六边形柱状网格（3D 拉伸）          |
| `square`         | 正方形网格（2D 平面）              |
| `squareColumn`   | 正方形柱状网格（3D 拉伸）          |
| `triangle`       | 三角形网格（2D 平面）              |
| `triangleColumn` | 三角形柱状网格（3D 拉伸）          |
| `cylinder`       | 圆柱聚合（3D 拉伸）                |

### shape('heatmap')

`shape` 为 `heatmap` 时，绘制 2D 经典高斯热力图，通过颜色渐变反映数据密度。

### shape('heatmap3D')

`shape` 为 `heatmap3D` 时，绘制 3D 热力图，在 Z 轴方向通过高度反映热力强度，需开启地图的 3D 视角。

### shape('hexagon') / shape('hexagonColumn')

基于六边形网格的聚合热力，`hexagon` 为 2D 填充，`hexagonColumn` 为 3D 柱状拉伸。需配合 `transforms` 中 `type: 'hexagon'` 使用。

### shape('square') / shape('squareColumn')

基于正方形网格的聚合热力，`square` 为 2D 填充，`squareColumn` 为 3D 柱状拉伸。需配合 `transforms` 中 `type: 'square'` 使用。

### shape('triangle') / shape('triangleColumn')

基于三角形网格的聚合热力，`triangle` 为 2D 填充，`triangleColumn` 为 3D 柱状拉伸。需配合 `transforms` 中 `type: 'triangle'` 使用。

### shape('cylinder')

基于圆形网格的聚合热力，以 3D 圆柱形式展示。需配合 `transforms` 中 `type: 'grid'` 使用。

### transforms

网格热力和蜂窝热力的实现依赖配置 `transforms` 的参数，[具体说明使用](/api/source/source/#transforms)。

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
