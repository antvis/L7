raster-rgb source synthesizes multi-band data into RGB data for display. For example, for LandSat8 data, we can perform RGB combination display according to the 5,4,3 or 4,3,2 bands.

- data data
- option configuration item
  - parser data parsing parameters
    - type parsing type`rgb`

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

data is an array type`RasterDataType[]`

- If it is a multi-band Tiff, you can directly use geotiff,js to read all bands.
- If it is a single file and single band data, it needs to be read separately and merged into one data.

Single file multi-band reading example

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

- type parsing type 'rgb'`必选`

- bands `[number,number,number] 指定 R/G/B 通道对应的数据索引,data 数组长度需要大于等于 3  `Required\`

  Note: The bands serial number starts from zero (bands 5, 4, and 3 in landsat 8 should be set to 4, 3, 2)

- width length`必选`

- height width`必选`

- countCut color stretching parameter`[number,number]`Value is percentage, default value`[2,98]` `可选`

### Complete example

[Raster RGB](../../../../examples/raster/rgb/#543)
