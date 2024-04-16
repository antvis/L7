---
title: Raster Tile
order: 7
---

<embed src="@/docs/api/common/style.md"></embed>

When L7 loads the raster tile map, it needs to be`source`Parse the tile service and configure the request parameters of the tile service.

## data

Tile URL, only supports EPSG 3857 coordinate system, supports TMS, WMS, WMTS protocols

### TMS

Pass parameters through url template, required to participate`{}`

- 1-4 server encoding {1-4}
- z zoom level
- x tile x coordinate
- y tile y coordinate

```js
const url = 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
```

### WMS

url template parameters

- 1-x server encoding {1-4}
- bbox tile range template BBOXSR only supports 4326, IMAGESR only supports 3857

Example

```js
const url =
  'https://pnr.sz.gov.cn/d-suplicmap/dynamap_1/rest/services/LAND_CERTAIN/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&layers=show:1&SIZE=256,256&BBOX={bbox}&BBOXSR=4326&IMAGESR=3857&DPI=90';
```

### WMTS

url template parameters

- 1-4 server encoding {1-4}

WMTS two ways

- The usage is similar to TMS, you can splice url strings
- Set service parameters through parser parameter wmtsOptions

```js
const url1 = 'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';
const layer1 = new RasterLayer({
  zIndex: 1,
}).source(url1, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    wmtsOptions: {
      layer: 'img',
      tileMatrixset: 'w',
      format: 'tiles',
    },
  },
});
```

## parser

### type

<description> _string_ **required** _default:_ rasterTile</description>The fixed value is`rasterTile`

### tileSize `number`

<description> _number_ **Optional** _default:_ 256</description>Request tile size optional

### zoomOffset

<description> number **Optional** *default:*0</description>Tile request tile level offset

### maxZoom

<description> _number_ **Optional** *default:*0</description>

Maximum tile zoom level`20`

### minZoom tile minimum zoom, etc.

<description> _number_ **Optional** _default:_ 2-</description>

### extent `[number, number, number, number]`Map display range

<description> _number\[]_ **Optional**not limited:\_</description>

### dataType

<description> _string_ **Optional** _default:_ image</description>

Tile data type

- image image type
- arraybuffer data type such as geotiff

### format function,

<description> _func_ **Optional**\_default:</description>

Used when data raster is used to format raster data into standard data and customize data processing functions

### wmtsOptions wmsts configuration

<description> _Object_ **Optional** _default:_ null</description>

#### layer

<description> _string_ **required** _default:_ img</description>Layers

#### tileMatrixset

<description> _string_ **required** _default:_ w</description>

#### format

<description> _string_ **required** _default:_ tiles</description>Service type

```javascript
const rasterSource = new Source(
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
      zoomOffset: 0,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);
```

<embed src="@/docs/api/common/source/tile/method.zh.md"></embed>
