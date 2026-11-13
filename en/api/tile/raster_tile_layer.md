---
title: "Raster 栅格瓦片"
description: "Raster 栅格瓦片"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/api/tile/raster_tile_layer/"
---

[Resource index](/llms.txt)

`L7`The raster layer supports loading`TMS`、`WMS`、`WMTS`and other image tiles in various formats, and also supports`Tiff`、`Lerc`Data raster tiles in various formats.

| Classification | Layer         | parserType   | dataType      | describe                          |
| -------------- | ------------- | ------------ | ------------- | --------------------------------- |
| grid tiles     | `RasterLayer` | `rasterTile` | `image`、`/`  | Picture grid                      |
| grid tiles     | `RasterLayer` | `rasterTile` | `arraybuffer` | data grid                         |
| grid tiles     | `RasterLayer` | `rasterTile` | `rgb`         | Color remote sensing image raster |

🌟 Currently only supports 3857 coordinate system

### source(url: string, option: IOption)

The data source of vector tiles needs to pass in the tile service of vector data and the corresponding configuration parameters.

#### url

The path processing of data services supports single service and multi-service writing methods, and also supports simultaneous requests for multiple files.

- Single server Requests tile data from one server.

- Multiple servers request tile data for the same service from multiple servers.
  - Use braces to request the setting of multiple servers, such as`{1-3}`、`{a-c}`。

- Request multiple files. Request tile data from multiple tile services at the same time.
  - Use an array to set up multiple services.
  - Currently, the format for requesting multiple files is only supported by raster tiles.

```js
import { Source } from '@antv/l7'
// single server
const source = new Source('http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...})

//Multiple servers
const source = new Source('http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}', {...} )

//Request multiple files
const urls = [
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
  'https://ganos.oss-cn-hangzhou.aliyuncs.com/m2/l7/tiff_jx/{z}/{x}/{y}.tiff',
]

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

#### source option

via configuration`parser`In the parameters, we can specify different tile types and parameters of the tile service.

```js
const source = new Source(url, {
  parser: {...}
})
```

| parameter      | type                               | default value                              | describe                              |
| -------------- | ---------------------------------- | ------------------------------------------ | ------------------------------------- |
| type           | `string`                           | /                                          | Describe the different types of tiles |
| tileSize       | `number`                           | `256`                                      | Requested tile size                   |
| minZoom        | `number`                           | `0`                                        | Request the minimum level of tiles    |
| maxZoom        | `number`                           | `Infinity`                                 | Request the maximum level of tiles    |
| zoomOffset     | `number`                           | `0`                                        | Request tile level offset             |
| extent         | `[number, number, number, number]` | `[-Infinity,-Infinity,Infinity,Infinity,]` | Request the bounds of a tile          |
| updateStrategy | `UpdateTileStrategy`               | `replace`                                  | Tile replacement strategy             |

```js
type UpdateTileStrategy = 'realtime' | 'overlap' | 'replace';
```

About using different grid tiles`parser`parameter.

| Tile type   | type         | dataType      | describe                    |
| ----------- | ------------ | ------------- | --------------------------- |
| TMS         | `rasterTile` | `image`       | Picture grid                |
| WMS         | `rasterTile` | `image`       | Picture grid                |
| WMTS        | `rasterTile` | `image`       | Picture grid                |
| arraybuffer | `rasterTile` | `arraybuffer` | Data raster, single channel |
| rgb         | `rasterRgb`  | `arraybuffer` | Data raster, multi-channel  |

🌟`WMTS`Format tiles have additional parameters.

| parameter     | type           | value | describe               |
| ------------- | -------------- | ----- | ---------------------- |
| `wmtsOptions` | `IWmtsOptions` | `/`   | Set request parameters |

`IWmtsOptions`The parameters are used for splicing`url`。

```js
interface IWmtsOptions {
  layer: string;
  version?: string;
  style?: string;
  format: string;
  service?: string;
  tileMatrixset: string;
}
```

#### parser parameters

##### type: string

Used to specify the parsing method of the tile service, the value is`rasterTile`and`mvt`。\
`rasterTile`For parsing of raster tiles,`mvt`For parsing of vector tiles.

##### dataType: string

use`dataType`Distinguish between picture raster and data raster, the value is`image`and`arraybuffer`,The default is`image`。

```javascript
//Set the image grid
layer.source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'image',
      ...
    }
  }
})

//Set data grid
layer.source({
  'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      ...
    }
  }
})
```

##### minZoom/maxZoom: number

Set the request level for tile data. When the map’s zoom level`zoom`less than`minZoom`after, or`zoom`more than the`maxZoom`No more new tiles will be requested.\
`minZoom`The default value is`-Infinity`。\
`maxZoom`The default value is`Infinity`。

##### tileSize: number

The set value is the tile size returned by the tile service.\
`tileSize`The default value is 256.\
ps: This value is determined when producing tiles, we set`tileSize`It needs to be consistent with what is returned by the tile service.

##### extent: \[number, number, number, number]

Set the boundary of requesting tile data, the format is`[minLng, maxLat, maxLng, minLat]`, only tile data within the range will be requested.

##### zoomOffset: number

The set value is used to change the level of requested tile data. Usually on the mobile terminal, higher-level tiles can be requested for better clarity.`zoomOffset`The default value of is 0

##### format: IRasterFormat

_IFormat_ **required**

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

## style

- The single-channel drawing result is controlled by a single numerical value, such as a grayscale image. The color corresponding to the numerical value can be configured by expressing`rampColors`Ribbon control.

```js
layer.style({
  opacity: 0.5,
});
```

### options

| style       | type               | describe                                                    | default value |
| ----------- | ------------------ | ----------------------------------------------------------- | ------------- |
| opacity     | `number`           | Graphic transparency                                        | `1`           |
| clampLow    | `boolean`          | Set as`true`, lower than`domain`data will not be displayed  | `false`       |
| clampHigh   | `boolean`          | Set as`true`, higher than`domain`data will not be displayed | `false`       |
| domain      | `[number, number]` | Data mapping interval                                       | `[ 0, 8000 ]` |
| noDataValue | `number`           | Values ​​that will not be displayed                         | `-9999999`    |
| rampColors  | `IRampColors`      | The color ramp for the range mapping color                  | `/`           |

### rampColors color ramps

- type type supports \`linear','quantize','custom','cat'
- colors color array
- positions data segmentation interval, optional, quantize does not need to set position, position is the original data value

⚠️ 2.13 new features

#### cat enumeration type ribbon

The enumeration type ribbon only supports integer types from 0 to 255, and positions are used to set the enumeration.

```tsx
{
  type:'cat',
  colors:['#e41a1c','#377eb8','#4daf4a','#984ea3','#ff7f00'],
  positions:[1,20,101,102,200],
}
```

#### quantize equally spaced classification ribbons

Equally spaced segments are evenly divided only according to the interval domain of the data, such as domain \[0,10000]. If it is divided into 5 segments, the distance between each segment is 2000.
There is no need to set positions for equal spacing. You only need to set colors. Set the number of segments according to the length of colors.

```tsx
rampColors: {
  type:'quantize',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac']
}
```

#### linear linear continuous ribbon

linear is an enhanced version of the existing continuous type. Positions supports setting source data without converting it to 0-1.

```tsx
rampColors: {
  type:'linear',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000]
}

⚠️ Compatible with versions before 2.13.0. When type is not set, the position value range is 0-1.
```

#### custom custom segmented ribbon

Customized segmented ribbons distinguish equal-spaced ribbons, and user-defined segment intervals.
The length of custom positions needs to be 1 more than the length of colors, and positions

```tsx
rampColors: {
  type:'custom',
  colors: ['#f0f9e8','#bae4bc','#7bccc4','#43a2ca','#0868ac'],
  positions [0,200,1000,4000,8000,10000]
}
```
