---
title: cluster
order: 2
---

<embed src="@/docs/api/common/style.md"></embed>

Aggregation graphs are usually used to describe the aggregation of data geographically. Similar to heat maps, they can be used to represent the concentration of data points.

🌟 Currently`L7`Only point data supports aggregated graphs. The clustering method mainly aggregates data from the data layer. In`Source`Method configuration`cluster`parameter.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*paQsRKykjL4AAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### accomplish

Let's introduce how to draw a common aggregation chart.

- you can`L7`Found on the official website[Online case](/examples/point/cluster/#cluster)

```js
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120.19382669582967, 30.258134],
    style: 'dark',
    zoom: 3,
  }),
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then((res) => res.json())
    .then((data) => {
      const pointLayer = new PointLayer({})
        .source(data, { cluster: true })
        .shape('circle')
        .scale('point_count', {
          type: 'quantile',
        })
        .size('point_count', [5, 10, 15, 20, 25])
        .active(true)
        .color('yellow')
        .style({
          opacity: 0.5,
          strokeWidth: 1,
        });
      scene.addLayer(pointLayer);
    });
});
```

### source

After accepting ordinary point data, the aggregation chart also needs to configure aggregation parameters.

```js
const source = new Source(data, {
  cluster: true,
  clusterOption: {
    radius: 40,
    minZoom: 0,
    maxZoom: 16,
  },
});
```

- `cluster: boolean`Indicates whether to perform aggregation operations on data. Currently only point layers support it. The default value is`false`。
- `clusterOption: IClusterOption`Specific aggregation parameters
  - `radius: number`Aggregation radius, default value is`40`。
  - `minZoom: number`Minimum aggregate zoom level, default value is`0`。
  - `maxZoom: number`Maximum aggregate zoom level, default value is`16`。

```js
interface IClusterOption {
  radius,
  minZoom
  maxZoom
}
```

[Online case](/examples/point/cluster#cluster)

### shape

Aggregation graphs use common aggregation styles,`shape`Just use the point layer type`shape`That’s it.

### FAQ

`PointLayer`The aggregation graph uses`WebGL`Drawing does not support customizing specific aggregation styles. You can use it if you have customized requirements.`MarkerLayer`The aggregation function, you can pass`DOM`Fully customizable styling.

[MarkerLayer Aggregation](/api/component/markerlayer)
