### data

Multi-band supports two data methods. The raster data coordinate system only supports 3857 projected raster. In the case of multi-band, data is an array type.

* Single file multiple bands
* Multiple single-band files form multi-band

```ts
[
    {
        data: tiffdata, // arraybuffer type raster source data
        bands: [6, 5, 2].map((v) => v - 1),//Single file with multiple bands does not need to be transmitted, the format function is used
    },
    ],
```

#### Single file multiple bands

data is unparsed tiff arraybuffer data, which is standardized by format in parser.

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

#### Multiple files and multiple bands

```ts
const urls = [
  {
    url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
    bands: [0]
  },
  {
    url: 'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff'
  },
  ...
]
const tileSource = new Source(urls, {...});
```

### parser

#### type:`rasterRgb`

Multi-band data image synthesis

#### extent: the latitude and longitude range of the raster \[minlng, minlat,maxLng, maxLat]

#### operation synthesis method

rgb will automatically stretch based on the maximum and minimum values

* type `rgb`

#### format data processing method, raster data parsing method

* Input parameters:

* data: source passed in parameters

* bands band number

* Return parameters:
  Return data is array type

```ts
[{
        rasterData: value[band],//parsed data
        width: value.width, // Grid width
        height: value.height, // grid height
        };
      ]
```

#### Example

```ts
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
