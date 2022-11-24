---
title: 聚合图
order: 2
---
<embed src="@/docs/common/style.md"></embed>

聚合图通常用来描述数据在地理上表现的聚合情况，类似热力图，可以用来表示数据点位的集中。    

🌟 目前 `L7` 只有点数据支持聚合图，聚类方法主要从数据层聚合数据，在 `Source` 方法配置 `cluster` 参数。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*paQsRKykjL4AAAAAAAAAAABkARQnAQ'>
  </div>
</div>

### 实现

下面我们来介绍如何绘制一个常见的聚合图。

- 你可以在 `L7` 官网上找到[在线案例](/examples/point/cluster/#cluster)

```js
import { Scene, PointLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 120.19382669582967, 30.258134 ],
    style: 'dark',
    zoom: 3
  })
});
scene.on('loaded', () => {
  fetch('https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json')
    .then(res => res.json())
    .then(data => {
      const pointLayer = new PointLayer({})
        .source(data, { cluster: true })
        .shape('circle')
        .scale('point_count', {
          type: 'quantile'
        })
        .size('point_count', [ 5, 10, 15, 20, 25 ])
        .active(true)
        .color('yellow')
        .style({
          opacity: 0.5,
          strokeWidth: 1
        });
      scene.addLayer(pointLayer);
    });
});
```

### source

聚合图在接受普通的点数据之后还需要配置聚合参数。

```js
const source = new Source(data, {
  cluster: true,
  clusterOption: {
    radius: 40,
    minZoom: 0,
    maxZoom: 16,
  }
})
```

- `cluster: boolean` 表示是否对数据进行聚合操作，目前只有点图层支持，默认值为 `false`。
- `clusterOption: IClusterOption` 具体的聚合参数
  - `radius: number` 聚合半径，默认值为 `40`。
  - `minZoom: number` 最小聚合缩放等级，默认值为 `0`。
  - `maxZoom: number` 最大聚合缩放等级，默认值为 `16`。

```js
interface IClusterOption {
  radius,
  minZoom
  maxZoom
}
```

[在线案例](/examples/point/cluster#cluster)

### shape

聚合图使用通用的聚合样式，`shape` 只要使用点图层类型的 `shape` 即可。

### FAQ

`PointLayer` 的聚合图采用 `WebGL` 绘制，不支持自定义具体聚合样式，如果有自定义的需求可以使用 `MarkerLayer` 的聚合功能，你可以通过 `Dom` 完全自定义样式。

[MarkerLayer 聚合](/api/component/markerlayer)
