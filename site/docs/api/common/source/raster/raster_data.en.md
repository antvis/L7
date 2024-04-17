Raster data is the visualization of data raster. The main source of raster data is satellite remote sensing data, such as digital elevation map, vegetation distribution map and night light map.

- data data
- option configuration item
  - parser data parsing parameters

### data

data The parsed data, which is an array

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

Taking geotiff as an example, the data needs to be parsed first and input to the source as data.

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
- extent: the latitude and longitude range of the raster \[minlng, minlat,maxLng, maxLat]
- width data width
- height data height

Add raster data to the map based on its latitude and longitude range.

```javascript
layer.source(rasterData, {
  parser: {
    type: 'raster',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

### Complete example

[Raster ndi](../../../../examples/raster/data/#dem)
