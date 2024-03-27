### data

Multi-band supports two data methods. The raster data coordinate system only supports 3857 projected rasters.

- Single file multiple bands
- Multiple single-band files form multi-band

#### Single file multiple bands

data is unparsed tiff arraybuffer data, which is standardized by format in parser

```ts
const url1 = 'https://gw.alipayobjects.com/zos/raptor/1667832825992/LC08_3857_clip_2.tif';
  async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
  }
}
layer.source(
    [
    {
        data: tiffdata,
        bands: [6, 5, 2].map((v) => v - 1),
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
        operation: {
        type: 'rgb',
        },
        extent: [
        130.39565357746957, 46.905730725742366, 130.73364094187343,
        47.10217234153133,
        ],
    },
    },
)
```

### parser

- type: raster
- extent: the latitude and longitude range of the raster \[minlng, minlat,maxLng, maxLat]

Add raster data to the map based on its latitude and longitude range.

```javascript
layer.source(rasterData, {
  parser: {
    type: 'raster',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

Users can directly pass in the binary data of the raster file.

- Supports transferring data from multiple files.
- Supports specifying the bands to be extracted from a raster file.

```js
interface IBandsData {
  data: ArrayBuffer; // Request the binary data of the loaded raster file
  bands?: number[]; // Specify the bands to load the raster file
}
//Load the data of band 0 by default
const source = new Source({ data: tiffData });
//Specify to load the data of tiffData 0 band
//Specify to load the data of band 0 and 1 of tiffData2
const source2 = new Source([
  { data: tiffData, bands: [0] },
  { data: tiffData2, bands: [0, 1] },
]);
```

#### parser

<description> _IParser_ **required** </description>

Provides the necessary parameters and methods for working with raster data.

```js
interface IParser {
  type: string;
  format: IRasterFormat;
  operation: IOperation;
  extent: number[];
}
```

##### type

<description> _string_ **required** </description>

- When the output result is single-channel data, the value is raster
- When the output result is multi-channel color, the value is rasterRgb.

##### format: IRasterFormat

<description> _IFormat_ **required** </description>

`format`Method used to extract band data from the incoming raster file binary data.

- The first parameter is the raster file binary data.
- The second parameter is the band that should be extracted from the raster file specified by the first parameter. The method parameter is what we pass`source`parameters passed`data`numerical value.
- `format`Is a`async`method.

```js
interface IRasterData {
  rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
  width: number;
  height: number;
}
type IRasterFormat = (
  data: ArrayBuffer,
  bands: number[],
) => Promise<IRasterData | IRasterData[]>;

const source = new Source(data, {
  parser: {
    format: async (data, bands) => {
      ...
      return {
        rasterData: bandData,
        width: 256;
        height: 256;
      }
    }
  }
})
```

1. `format`The return value of the method is raster data (`rasterData`) and the size`width`、`height`parameter.
2. `format`The method can return multiple copies of data, indicating that multiple band data are extracted from the current raster file.

##### operation: IOperation

<description> _IOperation_ **Optional** </description>

When loading multi-band data we can pass`operation`Configure the operation of band data.

🌟 We don’t need to configure it`operation`, the first band data extracted from the first raster file is used by default.

1. `operation`can be a function,`allbands`is the collection of all band data we extracted from all raster files.

```js
const parser = {
  operation: (allBands) => {
    // operation can be a function, allbands is the collection of all band data we extract from all raster files,
    // When setting up allbands, it is [band0]
    //The return value of the function is pure band data. Here we directly return the first band data.
    return allBands[0].rasterData;
  },
};
```

2. `operation`Can be a calculation expression in the form of an array.

```js
//The following expression can be paraphrased as band1 * 0.5, which means multiplying the values ​​of band 1 by 0.5 and returning
const parser = {
  operation: ['*', ['band', 1], 0.5],
};
```

3. `operation`Can be used nested:`['+', ['*', ['band', 0], 0.2], ['band', 1]]]`, the return result is:`band0 * 0.2 + band1`。

4. `operation`The result can be specified directly:`['band', 0]`。

5. `operation`The following mathematical operations are supported.

```js
/** Mathematical operations Perform mathematical operations based on calculation expressions
 * * * Math operators:
 * `['*', value1, value2]` returns `value1 * value2`
 * `['/', value1, value2]` returns `value1 / value2`
 * `['+', value1, value2]` returns `value1 + value2`
 * `['-', value1, value2]` returns `value2 - value1`
 * `['%', value1, value2]` returns `value1 % value2`
 * `['^', value1, value2]` returns `value1 ^ value2`
 * `['abs', value1]` returns `Math.abs(value1)`
 * `['floor', value1]` returns `Math.floor(value1)`
 * `['round', value1]` returns `Math.round(value1)`
 * `['ceil', value1]` returns `Math.ceil(value1)`
 * `['sin', value1]` returns `Math.sin(value1)`
 * `['cos', value1]` returns `Math.cos(value1)`
 * `['atan', value1, value2]` returns `n1===-1?Math.atan(n1): Math.atan2(n1, n2)`
 */
```

##### extent

<description> _number\[]_ **required** </description>

`extent`It describes the geographical interval covered by the raster data, and the numerical value specifies the longitude and latitude interval (lower left corner and upper right corner) of the area.

### Loading multi-channel (color) images

When using multi-band data, we support drawing color remote sensing images based on multi-band data, such as the false color image below.

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*jO7kTpuDiOQAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

#### data: IBandsData\[] | IBandsData

When drawing multi-channel images, multi-band data needs to be loaded

#### parser

Provides necessary parameters and methods for using raster data, specific uses and multi-band rasters.`parser`be consistent.

##### type

<description> _string_ **required** </description>

- When the output result is multi-channel color, the value is`rasterRgb`。

##### format: IRasterFormat

<description> _IFormat_ **required** </description>

When drawing multi-channel images, use the general`format`function.

##### operation: IOperation

<description> _IOperation_ **required** </description>

In order to draw multi-channel images, we must provide`operation`Configure specified multi-channel data.

1. When rendering a color multi-channel raster, you need to use an additional parser. At the same time, the color raster layer no longer supports parameters such as domain and rampColor. The rendering result is directly controlled by the numerical results of the r, g, and b channels calculated by the band.

2. Colored rasters are no longer compatible with the old data value transfer method (pass in the parsed raster data directly.

```js
const source = new Source(data, { // Colored rasters and single-channel rasters use the same rules
  parser: {
    type: 'rasterRgb', // use independent type type
    format: async (data, bands) {...}, // Colored rasters and single-channel rasters use the same format
    // operation is an object, specifying calculation expressions for the three rgb channels respectively.
    // operation must be configured
    operation: {
      r: ['*', ['band', 1], 0.5],
      g: ['band', 1],
      b: undefined // The channel of the default configuration expression will take the value of band 0 by default
    }
  }
```
