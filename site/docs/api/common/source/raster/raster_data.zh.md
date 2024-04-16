Raster data 数据栅格的可视化，栅格数据主要来源是卫星遥感数据，如数字高程图、植被分布图和夜光图。

- data 数据
- option 配置项
  - parser 数据解析参数

### data

data 解析后的数据，为数组

```ts
type RasterDataType =
  | Uint8Array
  | Int8Array
  | Uint16Array
  | Int16Array
  | Uint32Array
  | Int32Array
  | Float32Array
  | Float64Array;
```

以 geotiff 为例需要先将数据解析出来，作为 data 输入给 source

```tsx
import * as GeoTIFF from 'geotiff';

async function getTiffData() {
  async function getTiffData() {
    const response = await fetch(
      'https://gw.alipayobjects.com/zos/antvdemo/assets/light_clip/lightF182013.tiff',
    );
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();
    const values = await image.readRasters();
    return {
      data: values[0],
      width,
      height,
    };
  }
}
const tiffdata = await getTiffData();
layer.source(tiffdata.data, {
  parser: {
    type: 'raster',
    width: tiffdata.width,
    height: tiffdata.height,
    extent: [73.4821902409999979, 3.8150178409999995, 135.1066187319999869, 57.6300459959999998],
  },
});
```

### parser

- type: raster
- extent: 栅格的经纬度范围 [minlng, minlat,maxLng, maxLat]
- width 数据宽度
- height 数据高度

根据栅格数据的经纬度范围，将其添加到地图上。

```javascript
layer.source(rasterData, {
  parser: {
    type: 'raster',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

### 完整示例

[Raster ndi](../../../../examples/raster/data/#dem)
