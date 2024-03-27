raster-rgb source 是将多波段数据合成 RGB数据进行展示，如对 LandSat8 数据我们可以按照 5,4,3 或者 4,3,2 波段进行RGB组合显示

- data 数据
- option 配置项
  - parser 数据解析参数
    - type 解析类型 `rgb`

```ts
layer.source(bandsValues, {
  parser: {
    type: 'rgb',
    width: bandsValues.width,
    height: bandsValues.height,
    bands: [4, 3, 2], // 从零开始
    extent: [130.39565357746957, 46.905730725742366, 130.73364094187343, 47.10217234153133],
  },
});
```

### data

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

data 为数组类型 `RasterDataType[]`

- 如果是多波段 Tiff 可以直接使用geotiff,js 读取所有波段，
- 如果是单文件单波段数据，需要单独读取并合并成一个数据。

单文件多波段读取示例

```ts
async function getTiffData(url: string) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image1 = await tiff.getImage();
  const bandsValues = await image1.readRasters();
  return bandsValues;
}
```

### parser

- type 解析类型 'rgb' `必选`
- bands `[number,number,number] 指定 R/G/B 通道对应的数据索引,data 数组长度需要大于等于 3  `必选`

  注：bands 序号从零开始（landsat 8 里的 5，4,3 波段这样要设置为 4,3, 2）

- width 长度 `必选`
- height 宽度 `必选`
- countCut 颜色拉伸参数 `[number,number]` 数值为百分比，默认值 `[2,98]` `可选`

### 完整示例

[Raster RGB](../../../../examples/raster/rgb/#543)
