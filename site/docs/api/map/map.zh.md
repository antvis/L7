---
title: 地图 Map
order: 0
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建，创建管理
只需要通过 Scene 传入地图配置项即可。

L7 在内部解决了不同地图底图之间差异，同时 L7 层面统一管理地图的操作方法。

- Map 独立地图引擎，不需要底图、或者加载地图瓦片服务，不需要 Token

## import

```javascript
import { Map } from '@antv/l7-maps';
```

## Map 实例化

```ts
import { Scene, PointLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new Map({
    zoom: 10,
    minZoom: 0,
    maxZoom: 18,
  }),
});

scene.on('loaded', () => {
  // 添加地图底图
  const layer = new RasterLayer();
  layer.source(
    'https://webrd0{1-3}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        tileSize: 256,
        minZoom: 2,
        maxZoom: 18,
      },
    },
  );
  scene.addLayer(layer);
});
```

<embed src="@/docs/api/common/map.zh.md"></embed>
