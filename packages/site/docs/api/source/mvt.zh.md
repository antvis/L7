---
title: MVT
order: 6
---

`markdown:docs/common/style.md`

L7 加载矢量瓦片地图的时候需要在 `source` 中对瓦片服务进行解析，同时配置瓦片服务的请求参数。

## parser

- type string 固定值为 `mvt`
- tileSize number 请求瓦片的大小
- zoomOffset number 瓦片请求瓦片层级的偏移
- maxZoom number 瓦片加载最大 `zoom`
- minZoom number 瓦片加载最小 `zoom`
- extent [number, number, number, number] 地图显示范围

```javascript
const tileSource = new Source(
  'http://localhost:3000/zhejiang.mbtiles/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      zoomOffset: 0,
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);
```
