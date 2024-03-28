### data

多波段支持两种数据方式，栅格数据坐标系只支持 3857 投影的栅格

- 单文件多波段
- 多个单波段文件组成多波段

#### 单文件多波段

data 为未解析过 tiff arraybuffer 数据，在 parser 中 通过 format 进行数据标准化

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
- extent: 栅格的经纬度范围 [minlng, minlat,maxLng, maxLat]

根据栅格数据的经纬度范围，将其添加到地图上。

```javascript
layer.source(rasterData, {
  parser: {
    type: 'raster',
    extent: [121.168, 30.2828, 121.384, 30.4219],
  },
});
```

用户可以直接传入栅格文件的二进制数据。

- 支持传入多文件的数据。
- 支持指定某个栅格文件要提取的波段。

```js
interface IBandsData {
  data: ArrayBuffer; // 请求加载的栅格文件的二进制数据
  bands?: number[]; // 指定加载该栅格文件的波段
}
// 默认加载 0 波段的数据
const source = new Source({ data: tiffData });
// 指定加载 tiffData 0 波段的数据
// 指定加载 tiffData2 0、1 波段的数据
const source2 = new Source([
  { data: tiffData, bands: [0] },
  { data: tiffData2, bands: [0, 1] },
]);
```

#### parser

<description> _IParser_ **必选** </description>

为使用栅格数据的使用提供必要的参数和方法。

```js
interface IParser {
  type: string;
  format: IRasterFormat;
  operation: IOperation;
  extent: number[];
}
```

##### type

<description> _string_ **必选** </description>

- 输出结果为单通道数据的时候值为 raster
- 输出结果为多通道彩色的时候值为 rasterRgb

##### format: IRasterFormat

<description> _IFormat_ **必选** </description>

`format` 方法用于从传入的栅格文件二进制数据中提取波段数据。

- 第一个参数是栅格文件二进制数据。
- 第二个参数是第一个参数指定的栅格文件中应该提取的波段，方法参数是我们通过 `source` 参数传递的 `data` 数值。
- `format` 是一个 `async` 方法。

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

1. `format` 方法的返回值为栅格数据（`rasterData`）以及表示大小的 `width`、`height` 参数。
2. `format` 方法可以返回多份数据，表示从当前栅格文件中提取多份波段的数据。

##### operation: IOperation

<description> _IOperation_ **可选** </description>

在加载多波段数据的时候我们可以通过 `operation` 配置波段数据的运算。

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
 * `['*', value1, value2]` 返回  `value1 * value2`
 * `['/', value1, value2]` 返回 `value1 / value2`
 * `['+', value1, value2]` 返回 `value1 + value2`
 * `['-', value1, value2]` 返回 `value2 - value1`
 * `['%', value1, value2]` 返回 `value1 % value2`
 * `['^', value1, value2]` 返回  `value1 ^ value2`
 * `['abs', value1]`       返回  `Math.abs(value1)`
 * `['floor', value1]`     返回  `Math.floor(value1)`
 * `['round', value1]`     返回  `Math.round(value1)`
 * `['ceil', value1]`      返回  `Math.ceil(value1)`
 * `['sin', value1]`       返回  `Math.sin(value1)`
 * `['cos', value1]`       返回  `Math.cos(value1)`
 * `['atan', value1, value2]` 返回  `n1===-1?Math.atan(n1): Math.atan2(n1, n2)`
 */
```

##### extent

<description> _number[]_ **必选** </description>

`extent` 描述的是栅格数据覆盖的地理区间，数值指定的是区域的经纬度区间（左下角和右上角）。

### 加载多通道（彩色）影像

我们在使用多波段数据的时候支持根据多波段数据绘制彩色遥感影像，如下图的假彩色影像。

<div>
  <div style="width:60%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*jO7kTpuDiOQAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

#### data: IBandsData[] | IBandsData

绘制多通道影像的时候，需要加载多波段数据

#### parser

使用栅格数据的使用提供必要的参数和方法， 具体使用和多波段栅格的 `parser` 保持一致。

##### type

<description> _string_ **必选** </description>

- 输出结果为多通道彩色的时候值为 `rasterRgb`。

##### format: IRasterFormat

<description> _IFormat_ **必选** </description>

绘制多通道影像的时候，使用通用的 `format`函数。

##### operation: IOperation

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
