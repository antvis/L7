---
title: Raster Tile
order: 1
---

<embed src="@/docs/api/common/style.md"></embed>

Raster tile layers include image rasters and data rasters, where image rasters are usually loaded`png/jpg`Images, data rasters are loaded`tiff/lerc`and other raster data files.

### Draw picture raster - TMS

```javascript
// Image tile layer - satellite image
const layer = new RasterLayer().source(
  'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      updateStrategy: 'overlap',
    },
  },
);
```

### Draw image raster - WMS

```javascript
// Draw WMS format tiles
const url =
  'https://pnr.sz.gov.cn/d-suplicmap/dynamap_1/rest/services/LAND_CERTAIN/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&layers=show:1&SIZE=256,256&BBOX={bbox}&BBOXSR=4326&IMAGESR =3857&DPI=90';

const layer = new RasterLayer().source(url, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    zoomOffset: 1,
  },
});
```

### Draw picture raster - WMTS

```javascript
// Draw WMTS format tiles
const url1 = 'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';
const layer1 = new RasterLayer().source(url1, {
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

### Draw data raster - arraybuffer

```javascript
const tileSource = new Source(
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      tileSize: 256,
      maxZoom: 13.1,
      format: async (data) => {
        const tiff = await GeoTIFF.fromArrayBuffer(data);
        const image = await tiff.getImage();
        const width = image.getWidth();
        const height = image.getHeight();
        const values = await image.readRasters();
        return { rasterData: values[0], width, height };
      },
    },
  },
);

layer.source(tileSource).style({
  domain: [0.001, 11.001],
  clampLow: false,
  rampColors: {
    colors: colorList,
    positions,
  },
});
```

### Plot data raster - rgb

```javascript
const url = 'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
const tiffdata = await getTiffData(url);
const layer = new RasterLayer({ zIndex: 10 }).source(
  [
    {
      data: tiffdata,
      bands: [7, 6, 5].map((v) => v - 1),
    },
  ],
  {
    parser: {
      type: 'rasterRgb',
      format: async (data, bands) => {
        const tiff = await GeoTIFF.fromArrayBuffer(data);
        const image1 = await tiff.getImage();
        const value = await image1.readRasters();
        return bands.map((band) => {
          return {
            rasterData: value[band],
            width: value.width,
            height: value.height,
          };
        });
      },
      operation: 'rgb',
      extent: [130.39565357746957, 46.905730725742366, 130.73364094187343, 47.10217234153133],
    },
  },
);
```
