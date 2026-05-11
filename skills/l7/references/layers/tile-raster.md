---
skill_id: tile-raster
skill_name: 栅格瓦片图层
category: layers
difficulty: intermediate
tags: [raster-tile, tile-layer, wms, wmts, tms, satellite]
dependencies: [scene-initialization, raster-layer]
version: 2.x
---

# 栅格瓦片图层

## 技能描述

掌握 L7 栅格瓦片图层的使用，通过 RasterLayer 加载 TMS、WMS、WMTS 等多种格式的图片瓦片和数据瓦片。栅格瓦片将遥感影像、卫星图片等栅格数据按照瓦片金字塔结构组织，实现高效加载和渲染。

## 何时使用

- ✅ 需要加载卫星影像、航拍图等栅格底图
- ✅ 需要加载 WMS/WMTS 等标准地图服务
- ✅ 需要加载多光谱遥感影像数据
- ✅ 需要加载地形高程数据
- ✅ 需要同时加载多个波段的栅格数据

## 前置条件

- 已完成 [场景初始化](../core/scene.md)
- 了解 [RasterLayer](./raster.md) 基础用法
- 准备好栅格瓦片服务地址

## 核心概念

### 栅格瓦片类型

L7 支持多种栅格瓦片类型：

| 分类     | Layer         | parserType   | dataType      | 描述           |
| -------- | ------------- | ------------ | ------------- | -------------- |
| 图片栅格 | `RasterLayer` | `rasterTile` | `image`       | 普通图片瓦片   |
| 数据栅格 | `RasterLayer` | `rasterTile` | `arraybuffer` | 单通道数据瓦片 |
| 彩色遥感 | `RasterLayer` | `rasterRgb`  | `arraybuffer` | 多通道彩色影像 |

### 瓦片服务类型

- **TMS** (Tile Map Service) - 简单的 XYZ 瓦片服务
- **WMS** (Web Map Service) - OGC 标准的地图服务
- **WMTS** (Web Map Tile Service) - OGC 标准的瓦片服务
- **自定义瓦片** - 自定义格式的栅格瓦片

## 基础用法

### 1. 加载图片栅格瓦片

最常用的场景，加载卫星影像、电子地图等图片瓦片：

```javascript
import { Scene, RasterLayer } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [120, 30],
    zoom: 10,
  }),
});

scene.on('loaded', () => {
  const rasterLayer = new RasterLayer().source(
    'https://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    {
      parser: {
        type: 'rasterTile',
        dataType: 'image', // 图片栅格（默认值，可省略）
        tileSize: 256,
        minZoom: 0,
        maxZoom: 18,
      },
    },
  );

  scene.addLayer(rasterLayer);
});
```

### 2. 加载 WMTS 服务

WMTS 服务需要额外的配置参数：

```javascript
const wmtsLayer = new RasterLayer().source('https://tiles.services.ogc.org/wmts', {
  parser: {
    type: 'rasterTile',
    dataType: 'image',
    tileSize: 256,
    wmtsOptions: {
      layer: 'BlueMarble', // 图层名称
      version: '1.0.0', // WMTS 版本
      style: 'default', // 样式
      format: 'image/jpeg', // 格式
      service: 'WMTS', // 服务类型
      tileMatrixset: 'EPSG:3857', // 坐标系
    },
  },
});

scene.addLayer(wmtsLayer);
```

### 3. 加载多文件栅格瓦片

同时请求多个瓦片服务（如多波段遥感影像）：

```javascript
const urls = [
  'https://example.com/tiff_band1/{z}/{x}/{y}.tiff',
  'https://example.com/tiff_band2/{z}/{x}/{y}.tiff',
  'https://example.com/tiff_band3/{z}/{x}/{y}.tiff',
];

const multiBandLayer = new RasterLayer().source(urls, {
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer',
    tileSize: 256,
    format: async (data, bands) => {
      // 从二进制数据中提取波段数据
      const bandData = extractBandData(data, bands);
      return {
        rasterData: bandData,
        width: 256,
        height: 256,
      };
    },
  },
});

scene.addLayer(multiBandLayer);
```

### 4. 加载数据栅格瓦片

加载单通道数据瓦片（如高程数据、温度数据等）：

```javascript
const dataTileLayer = new RasterLayer().source('https://example.com/elevation/{z}/{x}/{y}.tiff', {
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer', // 数据栅格
    tileSize: 256,
    format: async (data, bands) => {
      // 处理二进制数据
      const view = new Uint8Array(data);
      return {
        rasterData: view,
        width: 256,
        height: 256,
      };
    },
  },
});

// 设置颜色映射
dataTileLayer.style({
  domain: [0, 5000], // 高程范围
  rampColors: {
    0: '#000000',
    1000: '#0000ff',
    2000: '#00ff00',
    3000: '#ffff00',
    4000: '#ff0000',
    5000: '#ffffff',
  },
});

scene.addLayer(dataTileLayer);
```

### 5. 加载 RGB 彩色遥感影像

```javascript
const rgbLayer = new RasterLayer().source('https://example.com/rgb/{z}/{x}/{y}.tiff', {
  parser: {
    type: 'rasterRgb', // RGB 类型
    dataType: 'arraybuffer',
    tileSize: 256,
  },
});

scene.addLayer(rgbLayer);
```

## 配置选项

### Source 配置参数

```typescript
interface IRasterTileSourceConfig {
  parser: {
    type: 'rasterTile' | 'rasterRgb'; // 解析器类型
    dataType?: 'image' | 'arraybuffer'; // 数据类型
    tileSize?: number; // 瓦片尺寸（默认 256）
    minZoom?: number; // 最小缩放级别
    maxZoom?: number; // 最大缩放级别
    zoomOffset?: number; // 层级偏移
    extent?: [number, number, number, number]; // 请求边界
    updateStrategy?: 'realtime' | 'overlap' | 'replace'; // 瓦片替换策略
    wmtsOptions?: IWmtsOptions; // WMTS 配置
    format?: IRasterFormat; // 自定义格式处理函数
  };
}
```

### 详细参数说明

#### type: string

指定瓦片服务的解析方式：

- `'rasterTile'` - 栅格瓦片解析（图片/数据）
- `'rasterRgb'` - RGB 彩色影像解析

#### dataType: string

区分图片栅格和数据栅格：

- `'image'` (默认) - 图片栅格，直接加载图片
- `'arraybuffer'` - 数据栅格，加载二进制数据

```javascript
// 图片栅格
layer.source(url, {
  parser: {
    type: 'rasterTile',
    dataType: 'image',
  },
});

// 数据栅格
layer.source(url, {
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer',
  },
});
```

#### tileSize: number

瓦片尺寸（像素），默认值为 256。

⚠️ **注意**：该值必须与瓦片服务返回的瓦片大小一致。

```javascript
parser: {
  type: 'rasterTile',
  tileSize: 512, // 512x512 瓦片
}
```

#### minZoom / maxZoom: number

设置瓦片请求的缩放级别范围：

```javascript
parser: {
  type: 'rasterTile',
  minZoom: 5, // 小于 5 级不请求瓦片
  maxZoom: 16, // 大于 16 级不请求瓦片
}
```

#### extent: [number, number, number, number]

设置请求瓦片的边界范围，格式为 `[minLng, minLat, maxLng, maxLat]`：

```javascript
parser: {
  type: 'rasterTile',
  extent: [73.66, 3.86, 135.05, 53.55], // 中国范围
}
```

#### zoomOffset: number

瓦片层级偏移，通常用于移动端请求更高清晰度的瓦片：

```javascript
parser: {
  type: 'rasterTile',
  zoomOffset: 1, // 请求高一级别的瓦片
}
```

#### updateStrategy: string

瓦片替换策略：

- `'replace'` (默认) - 替换旧瓦片
- `'overlap'` - 重叠过渡
- `'realtime'` - 实时更新

```javascript
parser: {
  type: 'rasterTile',
  updateStrategy: 'overlap', // 平滑过渡
}
```

#### wmtsOptions: IWmtsOptions

WMTS 服务专用配置：

```typescript
interface IWmtsOptions {
  layer: string; // 图层名称（必填）
  version?: string; // 版本，默认 '1.0.0'
  style?: string; // 样式，默认 'default'
  format: string; // 格式，如 'image/jpeg'
  service?: string; // 服务类型，默认 'WMTS'
  tileMatrixset: string; // 坐标系，如 'EPSG:3857'
}
```

#### format: IRasterFormat

自定义格式处理函数，用于从二进制数据中提取波段数据：

```javascript
parser: {
  type: 'rasterTile',
  dataType: 'arraybuffer',
  format: async (data: ArrayBuffer, bands: number[]) => {
    // data: 栅格文件的二进制数据
    // bands: 需要提取的波段
    // 返回处理后的数据
    const bandData = processBandData(data, bands);
    return {
      rasterData: bandData,
      width: 256,
      height: 256,
    };
  },
}
```

### URL 模板语法

#### 单服务器

```javascript
const url = 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';
```

#### 多服务器（负载均衡）

使用大括号语法请求多台服务器：

```javascript
// 数字范围
const url = 'http://webst0{1-4}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}';

// 字母范围
const url = 'http://tiles{s}.example.com/{z}/{x}/{y}.png';
// s 会被替换为 a, b, c 等
```

#### 请求多文件（数组方式）

同时请求多个瓦片服务：

```javascript
const urls = [
  'https://example.com/band1/{z}/{x}/{y}.tiff',
  'https://example.com/band2/{z}/{x}/{y}.tiff',
];

// 或者带波段配置
const urls = [
  {
    url: 'https://example.com/data/{z}/{x}/{y}.tiff',
    bands: [0], // 使用第 1 个波段
  },
  {
    url: 'https://example.com/data/{z}/{x}/{y}.tiff',
    bands: [1], // 使用第 2 个波段
  },
];

const source = new Source(urls, {
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer',
  },
});
```

## 样式配置

### 单波段栅格样式

```javascript
layer.style({
  domain: [0, 100], // 数据值域
  clampLow: true, // 限制低值
  clampHigh: true, // 限制高值
  noDataValue: -9999, // 无数据值
  rampColors: {
    0: '#000000',
    20: '#0000ff',
    40: '#00ff00',
    60: '#ffff00',
    80: '#ff0000',
    100: '#ffffff',
  },
});
```

### 多波段合成

```javascript
layer.style({
  channelRMax: 2000, // R 通道最大值
  channelGMax: 2000, // G 通道最大值
  channelBMax: 2000, // B 通道最大值
});
```

### 图像增强

```javascript
layer.style({
  brightness: 1.2, // 亮度
  contrast: 1.1, // 对比度
  saturation: 1.0, // 饱和度
  gamma: 1.0, // 伽马值
});
```

## 实际应用场景

### 1. 卫星影像底图

```javascript
const satelliteLayer = new RasterLayer().source(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'image',
      tileSize: 256,
      minZoom: 0,
      maxZoom: 19,
    },
  },
);

scene.addLayer(satelliteLayer);
```

### 2. 地形高程可视化

```javascript
const elevationLayer = new RasterLayer().source('https://example.com/dem/{z}/{x}/{y}.tiff', {
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer',
    tileSize: 512,
    format: async (data, bands) => {
      // 解析高程数据
      const elevationData = parseElevationData(data);
      return {
        rasterData: elevationData,
        width: 512,
        height: 512,
      };
    },
  },
});

// 设置高程颜色映射
elevationLayer.style({
  domain: [0, 8848], // 海平面到珠峰高度
  rampColors: {
    0: '#0000ff', // 海洋
    100: '#00ff00', // 平原
    500: '#ffff00', // 丘陵
    1000: '#ff9900', // 山地
    3000: '#ff0000', // 高山
    5000: '#ffffff', // 雪线
  },
});

scene.addLayer(elevationLayer);
```

### 3. 气象数据可视化

```javascript
const temperatureLayer = new RasterLayer().source(
  'https://example.com/temperature/{z}/{x}/{y}.tiff',
  {
    parser: {
      type: 'rasterTile',
      dataType: 'arraybuffer',
      tileSize: 256,
    },
  },
);

// 温度颜色映射
temperatureLayer.style({
  domain: [-30, 50], // 温度范围（摄氏度）
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

### 4. WMTS 服务加载

```javascript
const wmtsLayer = new RasterLayer().source('https://tiles.geoserver.org/wmts', {
  parser: {
    type: 'rasterTile',
    dataType: 'image',
    wmtsOptions: {
      layer: 'ne:NE1_HR_LC_SR_W_DR',
      version: '1.0.0',
      style: 'default',
      format: 'image/png',
      service: 'WMTS',
      tileMatrixset: 'EPSG:3857',
    },
  },
});

scene.addLayer(wmtsLayer);
```

### 5. 多光谱遥感影像

```javascript
const multispectralUrls = [
  {
    url: 'https://example.com/landsat/{z}/{x}/{y}.tiff',
    bands: [4], // 近红外波段
  },
  {
    url: 'https://example.com/landsat/{z}/{x}/{y}.tiff',
    bands: [3], // 红光波段
  },
  {
    url: 'https://example.com/landsat/{z}/{x}/{y}.tiff',
    bands: [2], // 绿光波段
  },
];

const landsatLayer = new RasterLayer().source(multispectralUrls, {
  parser: {
    type: 'rasterTile',
    dataType: 'arraybuffer',
    format: async (data, bands) => {
      // 处理多光谱数据
      const processedData = processMultispectralData(data, bands);
      return {
        rasterData: processedData,
        width: 256,
        height: 256,
      };
    },
  },
});

scene.addLayer(landsatLayer);
```

### 6. 动态切换底图

```javascript
// 创建多个底图图层
const satelliteLayer = new RasterLayer({ zIndex: 1 }).source(
  'https://satellite.example.com/{z}/{x}/{y}.jpg',
  { parser: { type: 'rasterTile' } },
);

const vectorLayer = new RasterLayer({ zIndex: 1 }).source(
  'https://vector.example.com/{z}/{x}/{y}.png',
  { parser: { type: 'rasterTile' } },
);

const darkLayer = new RasterLayer({ zIndex: 1 }).source(
  'https://dark.example.com/{z}/{x}/{y}.png',
  { parser: { type: 'rasterTile' } },
);

// 添加到场景
scene.addLayer(satelliteLayer);

// 切换底图
function switchBaseMap(type) {
  satelliteLayer.hide();
  vectorLayer.hide();
  darkLayer.hide();

  switch (type) {
    case 'satellite':
      satelliteLayer.show();
      break;
    case 'vector':
      vectorLayer.show();
      break;
    case 'dark':
      darkLayer.show();
      break;
  }
}
```

## 性能优化

### 1. 限制请求范围

```javascript
const source = new Source(url, {
  parser: {
    type: 'rasterTile',
    // 只请求中国范围内的瓦片
    extent: [73.66, 3.86, 135.05, 53.55],
  },
});
```

### 2. 合理设置缩放级别

```javascript
const source = new Source(url, {
  parser: {
    type: 'rasterTile',
    minZoom: 5, // 避免小级别请求过多瓦片
    maxZoom: 16, // 避免大级别请求过细瓦片
  },
});
```

### 3. 使用多服务器负载均衡

```javascript
// 使用 4 台服务器分散请求压力
const url = 'http://tiles{1-4}.example.com/{z}/{x}/{y}.png';
```

### 4. 选择合适的瓦片替换策略

```javascript
const source = new Source(url, {
  parser: {
    type: 'rasterTile',
    updateStrategy: 'overlap', // 平滑过渡，避免闪烁
  },
});
```

## 常见问题

### Q: 如何选择合适的 dataType？

A:

- 如果瓦片服务返回的是图片（JPG/PNG 等），使用 `'image'`
- 如果瓦片服务返回的是数据文件（TIFF 等），使用 `'arraybuffer'`

### Q: WMTS 服务不显示怎么办？

A: 检查以下几点：

1. `wmtsOptions` 配置是否完整
2. `layer` 名称是否正确
3. `tileMatrixset` 是否与坐标系匹配
4. 网络请求是否成功

### Q: 如何加载本地的栅格瓦片？

A: 使用本地服务器提供瓦片服务：

```javascript
const source = new Source('http://localhost:8080/tiles/{z}/{x}/{y}.png', {
  parser: {
    type: 'rasterTile',
    tileSize: 256,
  },
});
```

### Q: 栅格瓦片和矢量瓦片如何选择？

A:

| 场景             | 推荐方案 |
| ---------------- | -------- |
| 卫星影像、航拍图 | 栅格瓦片 |
| 地形高程数据     | 栅格瓦片 |
| 气象数据         | 栅格瓦片 |
| 道路、建筑矢量   | 矢量瓦片 |
| 行政区边界       | 矢量瓦片 |
| POI 点数据       | 矢量瓦片 |

### Q: 如何处理瓦片加载闪烁？

A: 使用 `overlap` 替换策略：

```javascript
parser: {
  type: 'rasterTile',
  updateStrategy: 'overlap', // 新旧瓦片重叠过渡
}
```

### Q: 如何自定义瓦片数据处理？

A: 使用 `format` 回调函数：

```javascript
parser: {
  type: 'rasterTile',
  dataType: 'arraybuffer',
  format: async (data, bands) => {
    // 自定义处理逻辑
    const processed = customProcess(data, bands);
    return {
      rasterData: processed,
      width: 256,
      height: 256,
    };
  },
}
```

## 注意事项

⚠️ **坐标系**：目前只支持 Web Mercator (EPSG:3857) 坐标系

⚠️ **瓦片尺寸**：`tileSize` 必须与瓦片服务返回的实际尺寸一致

⚠️ **跨域问题**：确保瓦片服务支持 CORS 跨域访问

⚠️ **性能考虑**：合理设置 `minZoom` 和 `maxZoom` 避免请求过多瓦片

⚠️ **数据格式**：确保 `format` 函数返回正确的数据格式和尺寸

⚠️ **多波段处理**：使用数组方式请求多文件时，注意波段顺序和合成方式

## 相关技能

- [RasterLayer](./raster.md) - 栅格图层基础
- [MVT 数据源](../data/source-mvt.md) - 矢量瓦片数据源
- [视觉映射](../visual/mapping.md) - 颜色映射配置
- [性能优化](../performance/optimization.md) - 性能优化指南

## 在线示例

查看更多示例：[L7 栅格瓦片示例](https://l7.antv.antgroup.com/examples/tile/raster)
