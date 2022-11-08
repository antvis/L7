---
title: 栅格瓦片
order: 1
---
`markdown:docs/common/style.md`

栅格瓦片图层包括图片栅格和数据栅格，其中图片栅格通常加载 `png/jpg` 图片，数据栅格则加载 `tiff/lerc` 等栅格数据文件.


<img width="80%" style="display: block;margin: 0 auto;" alt="瓦片图层" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*V45WTKljz-YAAAAAAAAAAAAAARQnAQ'>

### layer

栅格瓦片只通过  `RasterLayer` 来创建，同时我们需要根据不同的需求设置不同的 `source` 参数。

### source

栅格瓦片图层在使用图片栅格和数据栅格的时候需要使用不同的 `source` 参数。

- 通用参数

| 参数           | 类型                               | 默认值                                     | 描述                 |
| -------------- | ---------------------------------- | ------------------------------------------ | -------------------- |
| tileSize       | `number`                           | `256`                                      | 请求的瓦片尺寸       |
| minZoom        | `number`                           | `0`                                        | 请求瓦片的最小层级   |
| maxZoom        | `number`                           | `Infinity`                                 | 请求瓦片的最大层级   |
| zoomOffset     | `number`                           | `0`                                        | 请求瓦片层级的偏移量 |
| extent         | `[number, number, number, number]` | `[-Infinity,-Infinity,Infinity,Infinity,]` | 请求瓦片的边界       |
| updateStrategy | `UpdateTileStrategy`               | `replace`                                  | 瓦片的替换策略       |

```js
type UpdateTileStrategy = 'realtime' | 'overlap' | 'replace';
```

#### 图片栅格 - TMS

| 参数 | 类型     | 值           | 描述               |
| ---- | -------- | ------------ | ------------------ |
| type | `string` | `rasterTile` | 请求图片类型的瓦片 |

```js
const layer = new RasterLayer()
.source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      tileSize: 256,
    },
  },
);
```

- 图片栅格 - WMS

| 参数 | 类型     | 值           | 描述               |
| ---- | -------- | ------------ | ------------------ |
| type | `string` | `rasterTile` | 请求图片类型的瓦片 |

```js
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

| 参数        | 类型           | 值                 | 描述               |
| ----------- | -------------- | ------------------ | ------------------ |
| type        | `string`       | `rasterTile`       | 请求图片类型的瓦片 |
| wmtsOptions | `IWmtsOptions` | `\` | 设置请求参数 |

`IWmtsOptions` 的参数用于拼接 `url`。

```js
interface IWmtsOptions {
  layer: string;
  version?: string;
  style?: string;
  format: string;
  service?: string;
  tileMatrixset: string;
}
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

#### 数据栅格 - arraybuffer

| 参数     | 类型             | 值            | 描述               |
| -------- | ---------------- | ------------- | ------------------ |
| type     | `string`         | `rasterTile`  | 请求栅格类型的瓦片 |
| dataType | `RasterTileType` | `arraybuffer` | 栅格瓦片的类型     |

```js
enum RasterTileType {
  ARRAYBUFFER = 'arraybuffer';
  IMAGE = 'image';
  RGB = 'rgb';
}
 const tileSource = new Source('https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',{
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      tileSize: 256,
      maxZoom: 13.1,
      format: async data => {
        const tiff = await GeoTIFF.fromArrayBuffer(data);
        const image = await tiff.getImage();
        const width = image.getWidth();
        const height = image.getHeight();
        const values = await image.readRasters();
        return { rasterData: values[0], width, height };
      }
    }
  });
  const layer = new RasterLayer().source(tileSource)
  .style({
    domain: [ 0.001, 11.001 ],
    clampLow: false,
    rampColors: {
      colors: colorList,
      positions
    }
  });
```

#### 数据栅格 - rgb

| 参数     | 类型             | 值           | 描述               |
| -------- | ---------------- | ------------ | ------------------ |
| type     | `string`         | `rasterTile` | 请求栅格类型的瓦片 |
| dataType | `RasterTileType` | `rgb`        | 栅格瓦片的类型     |

```js
const canvas = document.createElement('canvas');
canvas.width = 256;
canvas.height = 256;
const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

  
const layer = new RasterLayer().source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {
  parser: {
    type: 'rasterTile',
    dataType: 'rgb',
    format: async (data: any) => {
      const blob: Blob = new Blob([new Uint8Array(data)], {type: 'image/png' });
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
        { rasterData: channelB, width: 256, height: 256 }
      ]
    },
    operation: {
      r: ['band', 0],
      g: ['band', 1],
      b: ['band', 2],
    }
  },
} )
```

#### parser

栅格瓦片在 `parser` 中解析瓦片服务，配置瓦片的参数。

##### type: string

用于指定瓦片服务的解析方式，值为 `rasterTile` 和 `mvt`。  
`rasterTile` 用于栅格瓦片的解析，`mvt` 用于矢量瓦片的解析。

##### dataType: string

使用 `dataType` 区分图片栅格和数据栅格，值为 `image` 和 `arraybuffer`，默认为 `image`。

```javascript
// 设置图片栅格
layer.source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'image',
      ...
    }
  }
})

// 设置数据栅格
layer.source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      ...
    }
  }
})
```

##### minZoom/maxZoom: number

设置瓦片数据的请求层级。当地图的缩放层级 `zoom` 小于 `minZoom` 后，或 `zoom` 大于 `maxZoom` 后将不再请求新的瓦片。  
`minZoom` 的默认值为 `-Infinity`。  
`maxZoom` 的默认值为 `Infinity`。

##### tileSize: number

设置的值是瓦片服务返回的瓦片大小。  
`tileSize` 的默认值为 256。  
ps： 该值在生产瓦片的时候确定，我们设置的 `tileSize` 需要和瓦片服务返回的保持一致。

##### extent: [number, number, number, number]

设置请求瓦片数据的边界， 格式是 `[minLng, maxLat, maxLng, minLat]`，只会请求范围内的瓦片数据。

##### zoomOffset: number

设置的值用于改变请求的瓦片数据的层级，通常在移动端可以请求更高一级的瓦片以获取更好的清晰度。
`zoomOffset` 的默认值为 0

#### 🌟 format: func

数据栅格支持额外的 format 参数用于解析栅格数据，需要将栅格数据解析成 L7 栅格图层接受的标准格式。

```javascript
// 解析 png
const tileSource = new Source(
'https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=YOUR_TOKRN',
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer',
    tileSize: 256,
    format: async (data: any) => {
      const blob: Blob = new Blob([new Uint8Array(data)], {
        type: 'image/png',
      });
      const img = await createImageBitmap(blob);
      ctx.clearRect(0, 0, 256, 256);
      ctx.drawImage(img, 0, 0, 256, 256);

      let imgData = ctx.getImageData(0, 0, 256, 256).data;
      let arr = [];
      for (let i = 0; i < imgData.length; i += 4) {
        const R = imgData[i];
        const G = imgData[i + 1];
        const B = imgData[i + 2];
        const d = -10000 + (R * 256 * 256 + G * 256 + B) * 0.1;
        arr.push(d);
      }
      return {
        rasterData: arr,
        width: 256,
        height: 256,
      };
    }
  })
  // 解析 Lerc
  // const image = Lerc.decode(data);
  // return {
  //   rasterData: image.pixels[0],
  //   width: image.width,
  //   height: image.height,
  // };

  // 解析 Tiff
  // const tiff = await GeoTIFF.fromArrayBuffer(data);
  // const image = await tiff.getImage();
  // const width = image.getWidth();
  // const height = image.getHeight();
  // const values = await image.readRasters();
  // return { rasterData: values[0], width, height };
```

[在线案例](/zh/examples/tile/raster#dem)

### style

栅格瓦片支持配置多种样式参数

#### opacity: number

```javascript
layer.style({
  opacity: 0.5,
});
```

#### domain: [number, number]

设置数据映射的定义域。  
ps：固定值域为 `[0, 1]`，我们将传入的值（domain） 映射到值域 `[0, 1]` 后从 `rampColor` 构建的色带上取颜色。

#### clampLow/clampHigh: boolean

`clampLow` 的默认值为 `false`，设置为 `true`，低于 `domain` 的数据将不显示。  
`clampHigh` 的默认值为 `false`，设置为 `true`，高于 `domain` 的数据将不显示。

#### rampColors

- colors  颜色数组
- positions 数据区间

配置值域映射颜色的色带，值域的范围为 `[0 - 1]`, 对应的我们需要为每一个 `position` 位置设置一个颜色值。

⚠️ colors, positions 的长度要相同

```javascript
layer.style({
  rampColors: {
    colors: ['#FF4818', '#F7B74A', '#FFF598', '#91EABC', '#2EA9A1', '#206C7C'],
    positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
  },
});
```

ps：⚠️ color, position 的长度要相同

## event

🌟 数据栅格支持图层事件，目前图片栅格暂时不支持图层事件。

### 绑定事件

🌟 数据栅格瓦片

```javascript
// 绑定事件的方式和普通图层保持一致
layer.on('click', e => {...})
```

### 事件参数

🌟 数据栅格瓦片
数据栅格瓦片的事件参数相比于普通图层的事件返回了新的参数。

#### value: number

🌟 数据栅格瓦片
鼠标事件位置的瓦片的实际数值。
