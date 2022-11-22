## Usage

1. 按图表方式，[在线示例](https://l7plot.antv.antgroup.com/zh/examples/choropleth/administrative#china-map)

```js
import { Choropleth } from '@antv/l7plot';

const choropleth = new Choropleth('container', options);
```

2. 按场景方式，[在线示例](/examples/choropleth/administrative#china-map)

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

Choropleth 具体 API 文档移步 [L7Plot 官网](https://l7plot.antv.antgroup.com/zh/docs/api/plots/choropleth)。
