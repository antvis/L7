---
title: Source
order: 2
---

`markdown:docs/common/style.md`

栅格体图层接受的并不是矢量的地理数据（GeoJSON），而是栅格数据。同时支持多种数据的传入形式。

```js
const source = new Source(data, {
    parser: {...},
});
```

### 加载解析完的栅格数据

对栅格文件的解析，波段的提取需要用户自己完成，传入给栅格图层的是解析完成的数据。在这种形式下栅格图层只能绘制单一波段的数据。

```js
async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage(); // 使用文件中的第一张图
  const width = image.getWidth();
  const height = image.getHeight();
  const values = await image.readRasters();
  return {
    data: values[0], // 使用 0 波段的数据
    width,
    height,
  };
}
const tiffdata = await getTiffData(); // 这是解析完的数据
const layer = new RasterLayer({}).source(tiffdata.data, {
  parser: {
    type: 'raster',
    width: tiffdata.width,
    height: tiffdata.height,
    extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
  },
});
```

#### data

用户需要传入解析完的栅格数据。

#### parser

指定使用栅格数据的参数。

##### type

<description> _string_ **必选** </description>

传入固定值为 raster

##### width

<description> _number_ **必选** </description>

栅格数据是二维的网格数据，`width` 参数用于指定网格的宽度。  
`width` 参数一般在使用诸如 `geotiff.js` 等栅格数据解析库的时候会同时返回。

##### height

<description> _number_ **必选** </description>

栅格数据是二维的网格数据，`height` 参数用于指定网格的宽度。  
`width` 参数一般在使用诸如 `geotiff.js` 等栅格数据解析库的时候会同时返回。

##### extent

<description> _number[]_ **必选** </description>

`extent` 描述的是栅格数据覆盖的地理区间，数值指定的是区域的经纬度区间（左下角和右上角）。

```js
const extent = [minLng, minLat, maxLng, maxLat];
```

### 加载未解析的栅格数据

可以加载多份栅格数据用于计算或者是展示多通道的数据（遥感真彩色、假彩色），此时需要额外提供栅格文件提取波段数据的方法。

```js
async function getTiffData() {
  const response = await fetch(
    'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
  );
  const arrayBuffer = await response.arrayBuffer();
  return arrayBuffer;
}
const tiffdata = await getTiffData();
const layer = new RasterLayer({});
layer.source(
  [
    {
      data: tiffdata,
      bands: [0],
    },
  ],
  {
    parser: {
      type: 'raster',
      format: async (data, bands) => {
        const tiff = await GeoTIFF.fromArrayBuffer(data);
        const imageCount = await tiff.getImageCount();
        const image = await tiff.getImage(bands[0]);
        const width = image.getWidth();
        const height = image.getHeight();
        const values = await image.readRasters();
        return { rasterData: values[0], width, height };
      },
      operation: ['+', ['band', 0], 1],
      extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
    },
  },
);
```

#### data: IBandsData[] | IBandsData

用户可以直接加载栅格文件的二进制数据，支持传入多文件的数据以及指定提取某个栅格文件的指定波段数据。

```js
interface IBandsData {
  data: ArrayBuffer; // 请求加载的栅格文件的二进制数据
  bands?: number[]; // 指定加载该栅格文件的波段
}
```

#### parser

指定解析栅格数据和使用栅格数据的方法和参数。

##### type

<description> _string_ **必选** </description>

- 输出结果为单通道数据的时候值为 raster
- 输出结果为多通道彩色的时候值为 rasterRgb

##### format: IRasterFormat

<description> _IFormat_ **必选** </description>

`format` 方法用于从传入的栅格文件二进制数据中提取波段数据，第一个参数是对应的栅格文件二进制数据，第二个参数是指定的该栅格文件中应该提取的波段，方法参数是我们通过[source](/zh/docs/api/raster/source#data-ibandsdata--ibandsdata) 参数传递的 `data` 数值。

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
```

1. `format` 方法的返回值为栅格数据（`rasterData`）以及表示大小的 `width`、`height` 参数。
2. `format` 方法可以返回多份数据，表示从当前栅格文件中提取多份波段的数据。

##### operation: _IOperation_

<description> _IOperation_ **可选** </description>

在加载多波段数据的时候我们可以通过 `operation` 对数据进行运算。

🌟 我们可以不配置 `operation`，此时默认使用第一个栅格文件提取的第一个波段数据

1. `operation` 可以是一个函数，`allbands` 是我们从所有栅格文件中提取的所有波段数据的集合。

```js
const parser = {
  operation: (allBands) => {
    // operation 可以是一个函数，allbands 是我们从所有栅格文件中提取的所有波段数据的集合，
    // 在设立 allbands 就是 [band0]
    // 函数的返回值是单纯的波段数据，在这里我们直接返回第一个波段的数据
    return allBands[0].rasterData;
  },
};
```

2. `operation` 可以是以数组形式存在的计算表达式.

```js
// 下面表达式可以转述为 band1 * 0.5，表示将波段1 的值都乘上 0.5 并返回
const parser = {
  operation: ['*', ['band', 1], 0.5],
};
```

3. `operation` 可以嵌套使用：`['+', ['*', ['band', 0], 0.2], ['band', 1]]]`，返回结果为：`band0 * 0.2 + band1`。

4. `operation` 可以直接指定结果：`['band', 0]`。

5. `operation` 支持以下的数学运算。

```js
/** 数学运算 根据计算表达式进行数学运算
 * * * Math operators:
 * `['*', value1, value2]` multiplies `value1` by `value2`
 * `['/', value1, value2]` divides `value1` by `value2`
 * `['+', value1, value2]` adds `value1` and `value2`
 * `['-', value1, value2]` subtracts `value2` from `value1`
 * `['%', value1, value2]` returns the result of `value1 % value2` (modulo)
 * `['^', value1, value2]` returns the value of `value1` raised to the `value2` power
 * `['abs', value1]` returns the absolute value of `value1`
 * `['floor', value1]` returns the nearest integer less than or equal to `value1`
 * `['round', value1]` returns the nearest integer to `value1`
 * `['ceil', value1]` returns the nearest integer greater than or equal to `value1`
 * `['sin', value1]` returns the sine of `value1`
 * `['cos', value1]` returns the cosine of `value1`
 * `['atan', value1, value2]` returns `atan2(value1, value2)`. If `value2` is not provided, returns `atan(value1)`
 */
```

##### extent

<description> _number[]_ **必选** </description>

`extent` 描述的是栅格数据覆盖的地理区间，数值指定的是区域的经纬度区间（左下角和右上角）。

### 加载多通道（彩色）影像

我们在使用使用多波段数据的时候支持根据多波段数据绘制多通道影像（主要是遥感彩色、假彩色等）。

#### data: IBandsData[] | IBandsData

绘制多通道影像的时候，需要加载[多波段数据](/zh/docs/api/raster/source#data-ibandsdata--ibandsdata)

#### parser

指定解析栅格数据和使用栅格数据的方法和参数。

##### type

<description> _string_ **必选** </description>

- 输出结果为多通道彩色的时候值为 rasterRgb

##### format: IRasterFormat

<description> _IFormat_ **必选** </description>

绘制多通道影像的时候，使用通用的[format](/zh/docs/api/raster/source#format-irasterformat)函数。

##### operation: _IOperation_

<description> _IOperation_ **必选** </description>

为了绘制多通道影像，我们必须要提供 `operation` 配置指定多通道数据。

1. 在渲染彩色多通道栅格的时候需要额外使用 parser，同时彩色栅格图层不再支持 domain、rampColor 等参数，渲染的结果直接由波段计算出的 r、g、b 通道的数值结果控制。

2. 彩色栅格不再兼容旧的数据传值方式（直接传入解析完的栅格数据。

```js
const source = new Source(data, { // 彩色栅格和单通道栅格使用相同的规则
  parser: {
    type: 'rasterRgb', // 使用独立的 type 类型
    format: async (data, bands) {...}, // 彩色栅格和单通道栅格 format 使用相同
    // operation 为对象，分别为 rgb 三通道指定计算表达式
    // operation 必须要配置
    operation: {
      r: ['*', ['band', 1], 0.5],
      g: ['band', 1],
      b: undefined // 缺省配置表达式的通道会默认取 0 号波段的值
    }
  }
```
