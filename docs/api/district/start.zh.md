---
title: 文档链接
order: 0
---

旧版地图行政区划组件 - [L7Boundary](https://antv.vision/L7-boundary/)

新版地图行政区划组件 - [L7Plot Choropleth](https://l7plot.antv.vision/zh/docs/api/plots/choropleth)

🌟 旧版本行政区划组件库不再继续维护，推荐使用 L7Plot 的 [Choropleth 行政区划图表](https://l7plot.antv.vision/zh/examples/gallery#category-%E8%A1%8C%E6%94%BF%E5%8C%BA%E5%9F%9F)。

## 使用方式

1. 按图表方式，[在线示例](https://l7plot.antv.vision/zh/examples/choropleth/administrative#china-map)

```js
import { Choropleth } from '@antv/l7plot';

const choropleth = new Choropleth('container', options);
```

2. 按场景方式，[在线示例](/zh/examples/choropleth/administrative#china-map)

```js
import { Scene, Mapbox } from '@antv/l7';
import { Choropleth } from '@antv/l7plot';

const scene = new Scene({
  id: 'container',
  map: new Mapbox({
    style: 'light',
    center: [102.447303, 37.753574],
    zoom: 5,
  }),
});

const choropleth = new Choropleth(options);

scene.on('loaded', () => {
  choropleth.addToScene(scene);
});
```

## API

Choropleth 具体 API 文档移步 [L7Plot 官网](https://l7plot.antv.vision/zh/docs/api/plots/choropleth)。
