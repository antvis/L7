---
title: MVTTile 矢量瓦片
order: 6
---

<embed src="@/docs/common/style.md"></embed>

L7 加载矢量瓦片地图的时候需要在 `source` 中对瓦片服务进行解析，同时配置瓦片服务的请求参数。

## parser

### type

<description> _string_ **必选** _default:_ mvt</description>

### tileSize `number`

<description> _number_ **可选** _default:_ 256</description>
请求瓦片的大小

### zoomOffset

<description> number **可选** _default:_ 0</description>
瓦片请求瓦片层级的偏移

### maxZoom

<description> _number_ **可选** _default:_ 0</description>
瓦片最大缩放等级 `20`

### minZoom

<description> _number_ **可选** _default:_ 2-</description>
瓦片最小缩放等

### extent `[number, number, number, number]`

<description> _number[]_ **可选** 不限制:\_ </description>
地图显示范围

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
