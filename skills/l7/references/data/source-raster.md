---
skill_id: source-raster
skill_name: 栅格数据源
category: data
difficulty: intermediate
tags: [raster, source, tiff, geotiff, satellite, remote-sensing]
dependencies: [scene-initialization, raster-layer]
version: 2.x
---

# 栅格数据源

## 技能描述

掌握 L7 栅格数据源的使用方法，包括栅格文件加载、多波段数据处理、遥感影像解析等。栅格数据源支持 GeoTIFF、普通图片等多种格式，可用于卫星影像、气象数据、地形高程等场景。

## 何时使用

- ✅ 需要加载 GeoTIFF 等栅格文件
- ✅ 需要处理多波段遥感影像数据
- ✅ 需要加载气象、海洋等科学数据
- ✅ 需要加载地形高程数据（DEM）
- ✅ 需要对栅格数据进行波段合成和计算

## 前置条件

- 已完成 [场景初始化](../core/scene.md)
- 了解 [RasterLayer](../layers/raster.md) 基础用法
- 准备好栅格数据文件（GeoTIFF 等）

## 核心概念

### 栅格数据类型

L7 支持多种栅格数据类型：

| 类型           | parser.type    | 数据格式   | 描述                         |
| -------------- | -------------- | ---------- | ---------------------------- |
| **Image**      | `'image'`      | 图片文件   | 普通图片（JPG/PNG 等）       |
| **Raster**     | `'raster'`     | 栅格文件   | 单波段栅格数据（GeoTIFF 等） |
| **RasterTile** | `'rasterTile'` | 瓦片服务   | 栅格瓦片服务                 |
| **RGB**        | `'rgb'`        | 多波段数据 | 三波段彩色影像               |
| **NDI**        | `'ndi'`        | 双波段数据 | 归一化指数计算（如 NDVI）    |

### 栅格数据格式

- **GeoTIFF** - 带地理信息的 TIFF 格式
- **TIFF** - 普通 TIFF 格式
- **PNG/JPG** - 普通图片格式
- **ArrayBuffer** - 二进制栅格数据

## 基础用法

### 1. 加载单张栅格图片

最基础的用法，加载单张栅格图片并指定地理范围：

```javascript
import { Scene, RasterLayer, Source } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 4,
  }),
});

scene.on('loaded', () => {
  const rasterLayer = new RasterLayer().source('https://example.com/data/raster.tif', {
    parser: {
      type: 'raster',
      extent: [73.66, 3.86, 135.05, 53.55], // 数据地理范围
      width: 1000, // 图片宽度（像素）
      height: 800, // 图片高度（像素）
    },
  });

  scene.addLayer(rasterLayer);
});
```

### 2. 加载多波段栅格数据

加载多个波段的栅格文件进行合成：

```javascript
const rasterData = [
  {
    data: 'https://example.com/band1.tif',
    bands: [0], // 使用第 1 个波段
  },
  {
    data: 'https://example.com/band2.tif',
    bands: [0],
  },
  {
    data: 'https://example.com/band3.tif',
    bands: [0],
  },
];

const rasterLayer = new RasterLayer().source(rasterData, {
  parser: {
    type: 'raster',
    extent: [73.66, 3.86, 135.05, 53.55],
    width: 1000,
    height: 800,
    format: async (data, bands) => {
      // 处理多波段数据
      const bandData = await extractBandData(data, bands);
      return {
        rasterData: bandData,
        width: 1000,
        height: 800,
      };
    },
  },
});

scene.addLayer(rasterLayer);
```

### 3. 加载 RGB 彩色影像

使用 `'rgb'` 类型加载三波段彩色影像：

```javascript
const rgbData = [
  'https://example.com/red_band.tif', // 红光波段
  'https://example.com/green_band.tif', // 绿光波段
  'https://example.com/blue_band.tif', // 蓝光波段
];

const rgbLayer = new RasterLayer().source(rgbData, {
  parser: {
    type: 'rgb',
    extent: [73.66, 3.86, 135.05, 53.55],
    width: 1000,
    height: 800,
    bands: [0, 1, 2], // R/G/B 波段索引
    countCut: [0, 255], // 值域裁剪范围
    RMinMax: [0, 255], // R 通道范围
    GMinMax: [0, 255], // G 通道范围
    BMinMax: [0, 255], // B 通道范围
  },
});

scene.addLayer(rgbLayer);
```

### 4. 计算归一化指数（如 NDVI）

使用 `'ndi'` 类型计算归一化植被指数：

```javascript
const ndiData = [
  'https://example.com/nir_band.tif', // 近红外波段
  'https://example.com/red_band.tif', // 红光波段
];

const ndviLayer = new RasterLayer().source(ndiData, {
  parser: {
    type: 'ndi',
    extent: [73.66, 3.86, 135.05, 53.55],
    width: 1000,
    height: 800,
    bands: [0, 1], // 使用第 1、2 波段
  },
});

// NDVI = (NIR - RED) / (NIR + RED)
// 自动计算归一化指数

ndviLayer.style({
  domain: [-1, 1], // NDVI 值域
  rampColors: {
    -1: '#800026',
    0: '#ffffb2',
    0.2: '#fd8d3c',
    0.4: '#2ca25f',
    0.6: '#006837',
    1: '#00441b',
  },
});

scene.addLayer(ndviLayer);
```

### 5. 加载本地栅格文件

通过 fetch 加载本地文件：

```javascript
async function loadLocalRaster(file) {
  const arrayBuffer = await file.arrayBuffer();

  const rasterLayer = new RasterLayer().source([arrayBuffer], {
    parser: {
      type: 'raster',
      extent: [116.0, 39.5, 117.0, 40.5], // 指定地理范围
      width: 1024,
      height: 1024,
      format: async (data) => {
        // 解析 GeoTIFF 数据
        const tiff = await parseGeoTIFF(data);
        return {
          rasterData: tiff.data,
          width: tiff.width,
          height: tiff.height,
        };
      },
    },
  });

  scene.addLayer(rasterLayer);
}

// 使用
const fileInput = document.getElementById('file-input');
fileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  loadLocalRaster(file);
});
```

## 配置选项

### Raster 数据源配置

```typescript
interface IRasterSourceConfig {
  parser: {
    type: 'raster' | 'rgb' | 'ndi'; // 解析器类型
    extent?: [number, number, number, number]; // 地理范围
    coordinates?: [[number, number], [number, number], [number, number], [number, number]]; // 角点坐标
    width: number; // 图片宽度（像素）
    height: number; // 图片高度（像素）
    min?: number; // 数据最小值
    max?: number; // 数据最大值
    format?: IRasterFormat; // 自定义格式处理
    operation?: IBandsOperation; // 波段运算
    bands?: number[]; // 波段索引（RGB/NDI）
    countCut?: [number, number]; // 值域裁剪（RGB）
    RMinMax?: [number, number]; // R 通道范围（RGB）
    GMinMax?: [number, number]; // G 通道范围（RGB）
    BMinMax?: [number, number]; // B 通道范围（RGB）
  };
}
```

### 详细参数说明

#### type: string

解析器类型：

- `'raster'` - 单波段栅格数据
- `'rgb'` - 三波段彩色影像
- `'ndi'` - 双波段归一化指数

#### extent: [number, number, number, number]

数据的地理范围，格式为 `[minLng, minLat, maxLng, maxLat]`：

```javascript
parser: {
  type: 'raster',
  extent: [73.66, 3.86, 135.05, 53.55], // 中国范围
}
```

#### coordinates: [[number, number], ...]

四个角点的经纬度坐标（替代 extent）：

```javascript
parser: {
  type: 'raster',
  coordinates: [
    [73.66, 3.86],    // 左下角
    [135.05, 3.86],   // 右下角
    [135.05, 53.55],  // 右上角
    [73.66, 53.55],   // 左上角
  ],
}
```

#### width / height: number

栅格数据的像素尺寸：

```javascript
parser: {
  type: 'raster',
  width: 1024,
  height: 1024,
}
```

⚠️ **注意**：必须与栅格文件的实际尺寸一致。

#### min / max: number

数据值的范围，用于颜色映射：

```javascript
parser: {
  type: 'raster',
  min: 0,
  max: 5000, // 如高程数据 0-5000 米
}
```

#### format: IRasterFormat

自定义格式处理函数：

```typescript
type IRasterFormat = (data: ArrayBuffer, bands: number[]) => Promise<IRasterData | IRasterData[]>;

interface IRasterData {
  rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
  width: number;
  height: number;
}
```

示例：

```javascript
parser: {
  type: 'raster',
  format: async (data, bands) => {
    // 使用 GeoTIFF.js 解析
    const tiff = await GeoTIFF.fromArrayBuffer(data);
    const image = await tiff.getImage();
    const raster = await image.readRasters();

    return {
      rasterData: raster[0],
      width: image.getWidth(),
      height: image.getHeight(),
    };
  },
}
```

#### operation: IBandsOperation

波段运算函数（多波段数据）：

```typescript
type IBandsOperation = (...bands: number[][]) => number[];
```

示例：

```javascript
parser: {
  type: 'raster',
  operation: (...bands) => {
    // 计算波段平均值
    const result = [];
    for (let i = 0; i < bands[0].length; i++) {
      let sum = 0;
      bands.forEach(band => {
        sum += band[i];
      });
      result.push(sum / bands.length);
    }
    return result;
  },
}
```

#### bands: number[]

波段索引（RGB/NDI 类型）：

```javascript
// RGB 类型
parser: {
  type: 'rgb',
  bands: [0, 1, 2], // R/G/B 波段
}

// NDI 类型
parser: {
  type: 'ndi',
  bands: [0, 1], // 波段 1/波段 2
}
```

#### countCut: [number, number]

值域裁剪范围（RGB 类型）：

```javascript
parser: {
  type: 'rgb',
  countCut: [0, 255], // 裁剪到 0-255
}
```

#### RMinMax / GMinMax / BMinMax: [number, number]

各通道的值域范围（RGB 类型）：

```javascript
parser: {
  type: 'rgb',
  RMinMax: [0, 2000], // R 通道范围
  GMinMax: [0, 2000], // G 通道范围
  BMinMax: [0, 2000], // B 通道范围
}
```

## 数据格式处理

### GeoTIFF 解析

使用 GeoTIFF.js 库解析 GeoTIFF 文件：

```javascript
import { GeoTIFF } from 'geotiff';

async function parseGeoTIFF(arrayBuffer) {
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const width = image.getWidth();
  const height = image.getHeight();
  const raster = await image.readRasters();

  return {
    rasterData: raster[0], // 第一个波段
    width,
    height,
    geotiff: tiff,
    image,
  };
}

// 使用
const layer = new RasterLayer().source('data.tif', {
  parser: {
    type: 'raster',
    format: parseGeoTIFF,
  },
});
```

### 多波段合成

```javascript
async function mergeBands(bands) {
  // bands 是一个数组，包含多个波段的数据
  const bandCount = bands.length;
  const pixelCount = bands[0].length;
  const result = new Float32Array(pixelCount);

  // 计算波段平均值
  for (let i = 0; i < pixelCount; i++) {
    let sum = 0;
    for (let b = 0; b < bandCount; b++) {
      sum += bands[b][i];
    }
    result[i] = sum / bandCount;
  }

  return result;
}

const layer = new RasterLayer().source(bandFiles, {
  parser: {
    type: 'raster',
    operation: mergeBands,
  },
});
```

### 波段提取

```javascript
async function extractBand(data, bandIndex) {
  const tiff = await GeoTIFF.fromArrayBuffer(data);
  const image = await tiff.getImage();
  const raster = await image.readRasters();

  return {
    rasterData: raster[bandIndex],
    width: image.getWidth(),
    height: image.getHeight(),
  };
}

const layer = new RasterLayer().source('multiband.tif', {
  parser: {
    type: 'raster',
    format: async (data, bands) => {
      return await extractBand(data, bands[0]);
    },
  },
});
```

## 实际应用场景

### 1. 地形高程可视化

```javascript
const demLayer = new RasterLayer().source('dem_data.tif', {
  parser: {
    type: 'raster',
    extent: [73.66, 3.86, 135.05, 53.55],
    min: 0,
    max: 8848, // 珠峰高度
    format: async (data) => {
      const tiff = await GeoTIFF.fromArrayBuffer(data);
      const image = await tiff.getImage();
      const raster = await image.readRasters();

      return {
        rasterData: raster[0],
        width: image.getWidth(),
        height: image.getHeight(),
      };
    },
  },
});

// 设置高程颜色
demLayer.style({
  domain: [0, 8848],
  rampColors: {
    0: '#0000ff', // 海洋
    100: '#00ff00', // 平原
    500: '#ffff00', // 丘陵
    1000: '#ff9900', // 山地
    3000: '#ff0000', // 高山
    5000: '#ffffff', // 雪线
  },
});

scene.addLayer(demLayer);
```

### 2. 卫星影像真彩色合成

```javascript
const landsatBands = [
  'landsat_band4.tif', // 红光
  'landsat_band3.tif', // 绿光
  'landsat_band2.tif', // 蓝光
];

const trueColorLayer = new RasterLayer().source(landsatBands, {
  parser: {
    type: 'rgb',
    extent: [116.0, 39.5, 117.0, 40.5],
    width: 1024,
    height: 1024,
    bands: [0, 1, 2],
    countCut: [0, 255],
    RMinMax: [0, 3000],
    GMinMax: [0, 3000],
    BMinMax: [0, 3000],
  },
});

scene.addLayer(trueColorLayer);
```

### 3. NDVI 植被指数计算

```javascript
const modisBands = [
  'modis_band2.tif', // 近红外 (NIR)
  'modis_band1.tif', // 红光 (RED)
];

const ndviLayer = new RasterLayer().source(modisBands, {
  parser: {
    type: 'ndi',
    extent: [73.66, 3.86, 135.05, 53.55],
    width: 1000,
    height: 1000,
    bands: [0, 1],
  },
});

// NDVI 颜色映射
ndviLayer.style({
  domain: [-1, 1],
  rampColors: {
    -1: '#800026', // 水体
    0: '#ffffb2',  // 裸土
    0.2: '#fd8d3c', // 稀疏植被
    0.4: '#2ca25f', // 中等植被
    0.6: '#006837', // 茂密植被
    1: '#00441b',  // 非常茂密
  },
});

scene.addLayer(ndviLayer);
```

### 4. 气象温度场可视化

```javascript
const temperatureLayer = new RasterLayer().source('temperature.tif', {
  parser: {
    type: 'raster',
    extent: [73.66, 3.86, 135.05, 53.55],
    min: -30,
    max: 50,
    format: async (data) => {
      const tiff = await GeoTIFF.fromArrayBuffer(data);
      const image = await tiff.getImage();
      const raster = await image.readRasters();

      return {
        rasterData: raster[0],
        width: image.getWidth(),
        height: image.getHeight(),
      };
    },
  },
});

// 温度颜色映射
temperatureLayer.style({
  domain: [-30, 50],
  rampColors: {
    -30: '#0000ff',
    -10: '#00ffff',
    0: '#00ff00',
    10: '#ffff00',
    20: '#ff9900',
    30: '#ff0000',
    50: '#800000',
  },
});

scene.addLayer(temperatureLayer);
```

### 5. 多时相对比

```javascript
// 加载不同时相的数据
const timeSeriesData = [
  { file: '2020_ndvi.tif', year: 2020 },
  { file: '2021_ndvi.tif', year: 2021 },
  { file: '2022_ndvi.tif', year: 2022 },
];

const layers = [];

timeSeriesData.forEach((item, index) => {
  const layer = new RasterLayer({
    zIndex: index,
    visible: index === 0, // 只显示第一个
  }).source(item.file, {
    parser: {
      type: 'raster',
      extent: [73.66, 3.86, 135.05, 53.55],
    },
  });

  layer.style({
    domain: [-1, 1],
    rampColors: ndviColors,
  });

  layers.push(layer);
  scene.addLayer(layer);
});

// 切换时相
function switchTimePhase(year) {
  layers.forEach((layer, index) => {
    if (timeSeriesData[index].year === year) {
      layer.show();
      layer.setIndex(999); // 移到最上层
    } else {
      layer.hide();
    }
  });
}
```

### 6. 动态加载用户上传数据

```javascript
class RasterUploader {
  constructor(scene) {
    this.scene = scene;
    this.currentLayer = null;
  }

  async upload(file) {
    const arrayBuffer = await file.arrayBuffer();

    // 解析 GeoTIFF 获取地理信息
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();

    // 创建栅格图层
    if (this.currentLayer) {
      this.scene.removeLayer(this.currentLayer);
    }

    this.currentLayer = new RasterLayer().source([arrayBuffer], {
      parser: {
        type: 'raster',
        width,
        height,
        format: async (data) => {
          const tiff = await GeoTIFF.fromArrayBuffer(data);
          const image = await tiff.getImage();
          const raster = await image.readRasters();

          return {
            rasterData: raster[0],
            width: image.getWidth(),
            height: image.getHeight(),
          };
        },
      },
    });

    this.scene.addLayer(this.currentLayer);

    // 自动适配范围
    this.currentLayer.fitBounds();
  }
}

// 使用
const uploader = new RasterUploader(scene);
document.getElementById('upload').addEventListener('change', (e) => {
  uploader.upload(e.target.files[0]);
});
```

## 性能优化

### 1. 使用 Web Worker 处理大数据

```javascript
// worker.js
self.addEventListener('message', async (e) => {
  const { arrayBuffer } = e.data;
  const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
  const image = await tiff.getImage();
  const raster = await image.readRasters();

  self.postMessage({
    rasterData: raster[0],
    width: image.getWidth(),
    height: image.getHeight(),
  });
});

// 主线程
const worker = new Worker('worker.js');
worker.postMessage({ arrayBuffer });
worker.onmessage = (e) => {
  const { rasterData, width, height } = e.data;

  const layer = new RasterLayer().source([rasterData], {
    parser: {
      type: 'raster',
      width,
      height,
    },
  });

  scene.addLayer(layer);
};
```

### 2. 分块加载大数据

```javascript
async function loadLargeRasterInChunks(url, chunkSize = 1024) {
  const response = await fetch(url);
  const contentLength = response.headers.get('content-length');
  const totalSize = parseInt(contentLength, 10);

  const chunks = [];
  let loaded = 0;

  while (loaded < totalSize) {
    const chunkResponse = await fetch(url, {
      headers: {
        Range: `bytes=${loaded}-${loaded + chunkSize - 1}`,
      },
    });
    const chunk = await chunkResponse.arrayBuffer();
    chunks.push(chunk);
    loaded += chunkSize;
  }

  // 合并 chunks
  const totalBuffer = new Uint8Array(totalSize);
  let offset = 0;
  chunks.forEach((chunk) => {
    totalBuffer.set(new Uint8Array(chunk), offset);
    offset += chunk.byteLength;
  });

  return totalBuffer.buffer;
}

// 使用
const arrayBuffer = await loadLargeRasterInChunks('large_file.tif');
```

### 3. 预加载常用数据

```javascript
// 预加载栅格数据到缓存
const rasterCache = new Map();

async function preloadRaster(url) {
  if (rasterCache.has(url)) return;

  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  rasterCache.set(url, arrayBuffer);
}

// 使用缓存的数据
async function createLayerFromCache(url, options) {
  const arrayBuffer = rasterCache.get(url);
  if (!arrayBuffer) {
    throw new Error('Raster not preloaded');
  }

  const layer = new RasterLayer().source([arrayBuffer], options);
  scene.addLayer(layer);
  return layer;
}
```

## 常见问题

### Q: 如何选择合适的 parser type？

A:

- 单波段数据（高程、温度等）→ `'raster'`
- 三波段彩色影像 → `'rgb'`
- 双波段指数计算（NDVI 等）→ `'ndi'`
- 瓦片服务 → `'rasterTile'`

### Q: 如何获取 GeoTIFF 的地理信息？

A: 使用 GeoTIFF.js 解析：

```javascript
const tiff = await GeoTIFF.fromArrayBuffer(data);
const image = await tiff.getImage();
const origin = image.getOrigin(); // 左上角坐标
const resolution = image.getResolution(); // 分辨率
const width = image.getWidth();
const height = image.getHeight();

// 计算范围
const extent = [
  origin[0], // minLng
  origin[1] - height * resolution[1], // minLat
  origin[0] + width * resolution[0], // maxLng
  origin[1], // maxLat
];
```

### Q: 如何处理无地理信息的栅格数据？

A: 手动指定 `extent` 或 `coordinates`：

```javascript
parser: {
  type: 'raster',
  extent: [minLng, minLat, maxLng, maxLat],
  // 或
  coordinates: [
    [minLng, minLat],
    [maxLng, minLat],
    [maxLng, maxLat],
    [minLng, maxLat],
  ],
}
```

### Q: 栅格数据和矢量数据如何叠加？

A: 通过 zIndex 控制图层顺序：

```javascript
// 底层：栅格数据
const rasterLayer = new RasterLayer({ zIndex: 1 }).source(...);

// 上层：矢量数据
const vectorLayer = new PointLayer({ zIndex: 2 }).source(...);

scene.addLayer(rasterLayer);
scene.addLayer(vectorLayer);
```

### Q: 如何优化大文件加载速度？

A:

1. 使用 Web Worker 避免阻塞主线程
2. 分块加载（Range 请求）
3. 预加载常用数据
4. 使用压缩格式（如 Cloud Optimized GeoTIFF）

### Q: 如何处理 nodata 值？

A: 在 style 中设置 `noDataValue`：

```javascript
layer.style({
  noDataValue: -9999, // 指定无数据值
  domain: [0, 5000],
  rampColors: {...},
});
```

## 注意事项

⚠️ **坐标系统**：确保栅格数据的坐标系与地图一致（Web Mercator）

⚠️ **数据范围**：`extent` 必须与栅格数据的实际地理范围匹配

⚠️ **像素尺寸**：`width` 和 `height` 必须与栅格文件实际尺寸一致

⚠️ **内存管理**：大文件加载注意内存使用，及时销毁不用的图层

⚠️ **跨域问题**：确保栅格数据文件支持 CORS 跨域访问

⚠️ **波段顺序**：多波段数据注意波段顺序（RGB/NDI）

## 相关技能

- [RasterLayer](../layers/raster.md) - 栅格图层
- [栅格瓦片图层](../layers/tile-raster.md) - 栅格瓦片
- [视觉映射](../visual/mapping.md) - 颜色映射配置
- [ImageLayer](../layers/image.md) - 图片图层

## 在线示例

查看更多示例：[L7 栅格数据示例](https://l7.antv.antgroup.com/examples/source/raster)
