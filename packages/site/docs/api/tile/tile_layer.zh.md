---
title: TileLayer
order: 0
---

`markdown:docs/common/style.md`

`L7` 的瓦片图层分为栅格瓦片和矢量瓦片两大类，同时提供了 `geojson-vt` 前端瓦片切分方案、数据栅格的彩色遥感影像渲染方案等等多种瓦片方案，用户可以按照自己的需求选取合适的瓦片方案。

<img width="100%" style="margin: 10px;display: block;margin: 0 auto;" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*duYYQoVY8EYAAAAAAAAAAAAAARQnAQ'>

### 分类

栅格瓦片可以加载图片或者是栅格数据，同时也支持绘制彩色遥感影像。

| 分类     | Layer         | parserType   | dataType      | 描述             |
| -------- | ------------- | ------------ | ------------- | ---------------- |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `image`、`/`  | 图片栅格         |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `arraybuffer` | 数据栅格         |
| 栅格瓦片 | `RasterLayer` | `rasterTile` | `rgb`         | 彩色遥感影像栅格 |

矢量瓦片支持绘制点、线、面图层矢量瓦片的前端切片 `geojson-vt`。同时，矢量瓦片还支持 TileDebugLayer、掩模图层。

| 分类     | Layer            | parserType                          | 描述                                      |
| -------- | ---------------- | ----------------------------------- | ----------------------------------------- |
| 矢量瓦片 | `PointLayer`     | parser of PointLayer、`geojsonvt`   | 矢量点图层                                |
| 矢量瓦片 | `LineLayer`      | parser of LineLayer、`geojsonvt`    | 矢量线图层                                |
| 矢量瓦片 | `PolygonLayer`   | parser of PolygonLayer、`geojsonvt` | 矢量几何体图层                            |
| 矢量瓦片 | `MaskLayer`      | parser of MaskLayer、`geojsonvt`    | 矢量掩模图层                              |
| 矢量瓦片 | `TileDebugLayer` | `/`                                 | `TileDebugLayer` 不需要执行 `source` 方法 |

### 使用

下面就介绍几种瓦片图层的简单使用。

#### 图片栅格 - TMS

```javascript
import { RasterLayer } from '@antv/l7';
// 图片瓦片图层 - 卫星图
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

#### 图片栅格 - WMS

```javascript
import { RasterLayer } from '@antv/l7';
// 绘制 WMS 格式瓦片
const url =
  'https://pnr.sz.gov.cn/d-suplicmap/dynamap_1/rest/services/LAND_CERTAIN/MapServer/export?F=image&FORMAT=PNG32&TRANSPARENT=true&layers=show:1&SIZE=256,256&BBOX={bbox}&BBOXSR=4326&IMAGESR=3857&DPI=90';

const layer = new RasterLayer().source(url, {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
    zoomOffset: 1,
  },
});
```

#### 图片栅格 - WMTS

```javascript
import { RasterLayer } from '@antv/l7';

// 绘制 WMTS 格式瓦片
const url1 =
  'https://t0.tianditu.gov.cn/img_w/wmts?tk=b72aa81ac2b3cae941d1eb213499e15e&';
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

#### 数据栅格 - arraybuffer

```javascript
import { RasterLayer } from '@antv/l7';
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

#### 数据栅格 - rgb

```javascript

// 绘制多通道彩色栅格
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
scene.on('loaded', () => {
    const layer = new RasterLayer()
    .source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
    parser: {
        type: 'rasterTile',
        dataType: 'rgb',
        tileSize: 256,
        zoomOffset: 0,
        extent: [-180, -85.051129, 179, 85.051129],
        minZoom: 0,
        format: async (data: any) => {
        const blob: Blob = new Blob([new Uint8Array(data)], { type: 'image/png' });
        const img = await createImageBitmap(blob);
        ctx.clearRect(0, 0, 256, 256);
        ctx.drawImage(img, 0, 0, 256, 256);
        const imgData = ctx.getImageData(0, 0, 256, 256).data;
        const channelR: number[] = [];
        const channelG: number[] = [];
        const channelB: number[] = [];
        for (let i = 0; i < imgData.length; i += 4) {
            const R = imgData[i];
            const G = imgData[i + 1];
            const B = imgData[i + 2];
            channelR.push(R);
            channelG.push(G);
            channelB.push(B);
        }
        return [
            { rasterData: channelR, width: 256, height: 256 },
            { rasterData: channelG, width: 256, height: 256 },
            { rasterData: channelB, width: 256, height: 256 },
        ];
        },
        operation: {
            r: ['band', 0],
            g: ['band', 1],
            b: ['band', 2],
        },
}})
```

#### 矢量瓦片 - point、line、polygon

```javascript
// 矢量瓦片图层
import {
  PointLayer,
  LineLayer,
  PolygonLayer,
  TileDebugLayer,
  MaskLayer,
} from '@antv/l7';

const vectorSource = new Source(
  'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf',
  {
    parser: {
      type: 'mvt',
      maxZoom: 9,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);

// 矢量点图层
const point = new PointLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2',
})
  .source(vectorSource)
  .shape('circle')
  .color('red')
  .size(10);

// 矢量线图层
const line = new LineLayer({
  featureId: 'COLOR',
  sourceLayer: 'ecoregions2',
})
  .source(vectorSource)
  .color('COLOR')
  .size(2);

// polygon 瓦片图层 - geojson-vt
fetch(
  'https://gw.alipayobjects.com/os/bmw-prod/2b7aae6e-5f40-437f-8047-100e9a0d2808.json',
)
  .then((d) => d.json())
  .then((data) => {
    const source = new Source(data, {
      parser: { type: 'geojsonvt', maxZoom: 9 },
    });
    const polygon = new PolygonLayer({ featureId: 'COLOR' })
      .source(source)
      .color('red');
  });
```

#### 矢量瓦片 - 掩模图层

```js

// 掩模瓦片图层
const mask = new MaskLayer({sourceLayer: 'ecoregions2' }).source( 'http://ganos.oss-cn-hangzhou.aliyuncs.com/m2/rs_l7/{z}/{x}/{y}.pbf' {
    parser: {
        type: 'mvt',
        maxZoom: 9,
        extent: [-180, -85.051129, 179, 85.051129],
    }});
```

#### 矢量瓦片 - 测试图层

```js
// 测试瓦片图层
const debugerLayer = new TileDebugLayer();
```
