---
title: Source
order: 0
---

`markdown:docs/common/style.md`

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
