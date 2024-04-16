raster-ndi(Normalized Difference Indices) source is to calculate the normalized index of multi-band data, such as calculating NDVI/NDWI and other indices.

- data data
- option configuration item
  - parser data parsing parameters
    - type parsing type`ndi`

```ts
layer.source(bandsValues, {
  parser: {
    type: 'ndi',
    width: bandsValues.width,
    height: bandsValues.height,
    bands: [4, 3], // start from zero
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

- bands `[number,number] 指定需要归一化的波段,data 数组长度需要大于等于 2  `Required\`

  Note: The bands serial number starts from zero (5, 4 in landsat 8, the band should be set to 4, 3)

- width length`必选`

- height width`必选`

### Complete example

[Raster ndi](../../../../examples/raster/ndi/#ndbi)
