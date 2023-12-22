### data

多波段支持两种数据方式，栅格数据坐标系只支持 3857 投影的栅格，多波段情况 data 为数组类型

- 单文件多波段
- 多个单波段文件组成多波段

```ts
[
    {
        data: tiffdata, // arraybuffer 类型栅格源数据
        bands: [6, 5, 2].map((v) => v - 1),// 单文件多波段可以不传，format 函数使用
    },
    ],

```

#### 单文件多波段

data 为未解析过 tiff arraybuffer 数据，在 parser 中 通过 format 进行数据标准化，

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
#### 多文件多波段

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

#### type: `rasterRgb`
  多波段数据影像合成
####  extent: 栅格的经纬度范围 [minlng, minlat,maxLng, maxLat]

####  operation 合成方式
 rgb 会自动根据最大值最小值进行拉伸处理

  - type `rgb`

#### format 数据处理方法，栅格数据解析方式
  
  - 入参数：
  - data: source 传入参数
  - bands 波段序号

-  返回参数：
    返回数据为数组类型
  ```ts
      [{
          rasterData: value[band],// 解析后的数据
          width: value.width, // 栅格宽度
          height: value.height, // 栅格高度
          };
        ]
  ```


#### 示例
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