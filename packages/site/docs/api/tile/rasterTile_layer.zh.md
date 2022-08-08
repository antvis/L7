---
title: 栅格瓦片图层
order: 1
---

`markdown:docs/common/style.md`

L7 的栅格瓦片图层支持了图片栅格瓦片和数据栅格瓦片，其中图片栅格加载普通的 png/jpg 图片，数据栅格可以用于加载 tiff/lerc 文件，也可以加载 png/jpg 等图片作为解析文件。

## 栅格瓦片图层

```javascript
// 栅格瓦片图层
import { RasterLayer } from '@antv/l7';
```

<img width="80%" style="display: block;margin: 0 auto;" alt="瓦片图层" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*V45WTKljz-YAAAAAAAAAAAAAARQnAQ'>

[在线案例](/zh/examples/tile/raster#amap-normal)

### option

#### mask

栅格瓦片图层可以在初始化的时候配置瓦片的掩模。

```javascript
const maskData = [...] // geojson
const layer = new RasterLayer({
  mask: true,
  maskfence: maskData;
 });
```

### source

L7 瓦片图层统一在 `source` 中配置瓦片服务，同时用于区别普通的 L7 图层。

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

🌟 数据栅格瓦片

设置数据映射的定义域。  
ps：固定值域为 `[0, 1]`，我们将传入的值（domain） 映射到值域 `[0, 1]` 后从 `rampColor` 构建的色带上取颜色。

#### clampLow/clampHigh: boolean

🌟 数据栅格瓦片

`clampLow` 的默认值为 `false`，设置为 `true`，低于 `domain` 的数据将不显示。  
`clampHigh` 的默认值为 `false`，设置为 `true`，高于 `domain` 的数据将不显示。

#### rampColors

🌟 数据栅格瓦片

配置瓦片值域映射颜色的色带。

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
