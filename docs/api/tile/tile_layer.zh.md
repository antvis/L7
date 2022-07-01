---
title: 瓦片图层
order: 0
---

`markdown:docs/common/style.md`

L7 瓦片图层提供了对图片栅格瓦片、数据栅格瓦片、矢量瓦片的支持，通过使用瓦片图层，用户可以更加自由的选择地图底图，同时使用瓦片图层作为底图意味着不会增加 `webgl` 实例，对需要同时使用多个地图图表的情形更加友好。

### layer

L7 瓦片图层支持多种类型。

```javascript
// 栅格瓦片图层
import { RasterLayer } from '@antv/l7';

// 矢量瓦片图层
import { PointLayer } from '@antv/l7';
import { LineLayer } from '@antv/l7';
import { PolygonLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*duYYQoVY8EYAAAAAAAAAAAAAARQnAQ'>

### source

L7 的瓦片图层复用了原有的普通图层，在使用上通过 `source` 来进行区分。

```javascript
// 普通图层在 source 中直接传入数据，而瓦片图层则在 source 中设置瓦片服务

import { Source } from '@antv/l7'
const RasterTileSource = new Source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      ...
    }
  }
})

// 设置栅格瓦片服务
layer.source(RasterTileSource)

const VectorTileSource = new Source({
  'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      ...
    }
  }
})
// 设置矢量瓦片服务
layer.source(VectorTileSource)
```
