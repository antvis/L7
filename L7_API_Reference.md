# L7 可视化库完整 API 参考文档

> 生成日期: 2026-05-06  
> 基于源码分析

---

## 目录

1. [Scene 模块](#1-scene-模块)
2. [Source 模块](#2-source-模块)
3. [Map 模块](#3-map-模块)
4. [Component 模块](#4-component-模块)
5. [Layers 模块](#5-layers-模块)

---

## 1. Scene 模块

**导入路径**: `@antv/l7-scene` 或 `@antv/l7`

### Scene 类

L7 的核心入口类，管理地图、图层、控件等一切资源。

```typescript
import { Scene } from '@antv/l7';
```

#### 构造函数

```typescript
constructor(config: ISceneConfig)
```

#### ISceneConfig 配置项

| 属性               | 类型                       | 默认值         | 说明                                             |
| ------------------ | -------------------------- | -------------- | ------------------------------------------------ |
| `id`               | `string \| HTMLDivElement` | -              | **必填**，地图容器 DOM id 或元素                 |
| `map`              | `IMapWrapper`              | -              | **必填**，地图实例 (GaodeMap/Mapbox/MapLibre 等) |
| `canvas`           | `HTMLCanvasElement`        | -              | 可选，自定义 canvas                              |
| `gl`               | `any`                      | -              | 可选，自定义 WebGL 上下文                        |
| `renderer`         | `'regl' \| 'device'`       | `'device'`     | 渲染器类型                                       |
| `logoPosition`     | `PositionName`             | `'bottomleft'` | Logo 位置                                        |
| `logoVisible`      | `boolean`                  | `true`         | 是否显示 Logo                                    |
| `animate`          | `boolean`                  | -              | 是否启用动画                                     |
| `fitBoundsOptions` | `unknown`                  | -              | fitBounds 选项                                   |
| `pickBufferScale`  | `number`                   | -              | 拾取缓冲区缩放比例                               |
| `stencil`          | `boolean`                  | -              | 是否启用 stencil mask                            |
| `debug`            | `boolean`                  | `false`        | 是否启用调试模式                                 |

#### 属性

| 属性     | 类型      | 说明               |
| -------- | --------- | ------------------ |
| `map`    | `RawMap`  | 底层地图实例       |
| `loaded` | `boolean` | 场景是否已加载完成 |

#### 地图控制方法

| 方法                    | 签名                                                         | 说明                 |
| ----------------------- | ------------------------------------------------------------ | -------------------- |
| `getZoom`               | `(): number`                                                 | 获取当前缩放级别     |
| `getCenter`             | `(options?: ICameraOptions): ILngLat`                        | 获取地图中心点       |
| `setCenter`             | `(center: [number, number], options?: ICameraOptions): void` | 设置地图中心点       |
| `getPitch`              | `(): number`                                                 | 获取倾斜角度         |
| `setPitch`              | `(pitch: number): void`                                      | 设置倾斜角度         |
| `getRotation`           | `(): number`                                                 | 获取旋转角度         |
| `setRotation`           | `(rotation: number): void`                                   | 设置旋转角度         |
| `getBounds`             | `(): Bounds`                                                 | 获取当前地图边界     |
| `setZoom`               | `(zoom: number): void`                                       | 设置缩放级别         |
| `zoomIn`                | `(): void`                                                   | 放大一级             |
| `zoomOut`               | `(): void`                                                   | 缩小一级             |
| `panTo`                 | `(p: Point): void`                                           | 平移到指定位置       |
| `panBy`                 | `(x: number, y: number): void`                               | 按像素偏移平移       |
| `fitBounds`             | `(bound: Bounds, options?: unknown): void`                   | 适应边界范围         |
| `setZoomAndCenter`      | `(zoom: number, center: Point): void`                        | 同时设置缩放和中心   |
| `setMapStyle`           | `(style: any): void`                                         | 设置地图样式         |
| `setMapStatus`          | `(options: Partial<IStatusOptions>): void`                   | 设置地图交互状态     |
| `getMinZoom`            | `(): number`                                                 | 获取最小缩放级别     |
| `getMaxZoom`            | `(): number`                                                 | 获取最大缩放级别     |
| `getType`               | `(): string`                                                 | 获取地图类型         |
| `getSize`               | `(): [number, number]`                                       | 获取地图尺寸         |
| `getMapContainer`       | `(): HTMLElement \| null`                                    | 获取地图容器元素     |
| `getMapCanvasContainer` | `(): HTMLElement`                                            | 获取地图 Canvas 容器 |
| `getMapService`         | `(): IMapService`                                            | 获取地图服务实例     |
| `setBgColor`            | `(color: string): void`                                      | 设置地图背景色       |
| `getContainer`          | `(): HTMLElement \| null`                                    | 获取地图容器         |

**IStatusOptions 选项**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `showIndoorMap` | `boolean` | 是否显示室内地图 |
| `resizeEnable` | `boolean` | 是否允许缩放 |
| `dragEnable` | `boolean` | 是否允许拖拽 |
| `keyboardEnable` | `boolean` | 是否允许键盘操作 |
| `doubleClickZoom` | `boolean` | 是否允许双击缩放 |
| `zoomEnable` | `boolean` | 是否允许缩放 |
| `rotateEnable` | `boolean` | 是否允许旋转 |

#### 坐标转换方法

| 方法                | 签名                      | 说明             |
| ------------------- | ------------------------- | ---------------- |
| `pixelToLngLat`     | `(pixel: Point): ILngLat` | 像素坐标转经纬度 |
| `lngLatToPixel`     | `(lnglat: Point): IPoint` | 经纬度转像素坐标 |
| `containerToLngLat` | `(pixel: Point): ILngLat` | 容器坐标转经纬度 |
| `lngLatToContainer` | `(lnglat: Point): IPoint` | 经纬度转容器坐标 |

#### 图层管理方法

| 方法             | 签名                                                   | 说明             |
| ---------------- | ------------------------------------------------------ | ---------------- |
| `addLayer`       | `(layer: ILayer): void`                                | 添加图层         |
| `removeLayer`    | `(layer: ILayer, parentLayer?: ILayer): Promise<void>` | 移除图层         |
| `removeAllLayer` | `(): Promise<void>`                                    | 移除所有图层     |
| `getLayers`      | `(): ILayer[]`                                         | 获取所有图层     |
| `getLayer`       | `(id: string): ILayer \| undefined`                    | 根据 id 获取图层 |
| `getLayerByName` | `(name: string): ILayer \| undefined`                  | 根据名称获取图层 |
| `getPickedLayer` | `(): any`                                              | 获取拾取的图层   |

#### 控件方法

| 方法               | 签名                    | 说明             |
| ------------------ | ----------------------- | ---------------- |
| `addControl`       | `(ctr: IControl): void` | 添加控件         |
| `removeControl`    | `(ctr: IControl): void` | 移除控件         |
| `getControlByName` | `(name: string): any`   | 根据名称获取控件 |

#### Marker / Popup 方法

| 方法                | 签名                          | 说明         |
| ------------------- | ----------------------------- | ------------ |
| `addMarker`         | `(marker: IMarker): void`     | 添加标注     |
| `addMarkerLayer`    | `(layer: IMarkerLayer): void` | 添加标注图层 |
| `removeMarkerLayer` | `(layer: IMarkerLayer): void` | 移除标注图层 |
| `removeAllMarkers`  | `(): void`                    | 移除所有标注 |
| `addPopup`          | `(popup: IPopup): void`       | 添加气泡     |
| `removePopup`       | `(popup: IPopup): void`       | 移除气泡     |

#### 资源方法

| 方法                | 签名                                                   | 说明             |
| ------------------- | ------------------------------------------------------ | ---------------- |
| `addImage`          | `(id: string, img: IImage): Promise<void>`             | 添加图片资源     |
| `hasImage`          | `(id: string): boolean`                                | 检查图片是否存在 |
| `removeImage`       | `(id: string): void`                                   | 移除图片资源     |
| `addIconFont`       | `(name: string, fontUnicode: string): void`            | 添加图标字体     |
| `addIconFonts`      | `(options: string[][]): void`                          | 批量添加图标字体 |
| `addFontFace`       | `(fontFamily: string, fontPath: string): void`         | 添加自定义字体   |
| `addIconFontGlyphs` | `(fontFamily: string, glyphs: IIconFontGlyph[]): void` | 添加图标字体字形 |

#### 渲染 / 导出方法

| 方法                    | 签名                                       | 说明                 |
| ----------------------- | ------------------------------------------ | -------------------- |
| `render`                | `(): void`                                 | 手动触发渲染         |
| `setEnableRender`       | `(flag: boolean): void`                    | 启用/禁用渲染        |
| `exportPng`             | `(type?: 'png' \| 'jpg'): Promise<string>` | 导出为图片           |
| `exportMap`             | `(type?: 'png' \| 'jpg'): Promise<string>` | 导出地图图片(含底图) |
| `registerRenderService` | `(render: any): void`                      | 注册自定义渲染服务   |
| `enableShaderPick`      | `(): void`                                 | 启用 Shader 拾取     |
| `disableShaderPick`     | `(): void`                                 | 禁用 Shader 拾取     |
| `startAnimate`          | `(): void`                                 | 开始动画             |
| `stopAnimate`           | `(): void`                                 | 停止动画             |
| `getPointSizeRange`     | `(): Float32Array`                         | 获取点大小范围       |

#### Mask 方法

| 方法       | 签名                                    | 说明       |
| ---------- | --------------------------------------- | ---------- |
| `addMask`  | `(mask: ILayer, layerId: string): void` | 添加蒙层   |
| `initMask` | `(layer: ILayer): ILayer \| undefined`  | 初始化蒙层 |

#### 后处理效果

| 方法                         | 签名                                                                            | 说明                 |
| ---------------------------- | ------------------------------------------------------------------------------- | -------------------- |
| `registerPostProcessingPass` | `(constructor: new(...args: any[]) => IPostProcessingPass, name: string): void` | 注册自定义后处理效果 |

#### Box Select (框选)

| 方法               | 签名                     | 说明     |
| ------------------ | ------------------------ | -------- |
| `enableBoxSelect`  | `(once?: boolean): void` | 启用框选 |
| `disableBoxSelect` | `(): void`               | 禁用框选 |

#### 数据协议

| 方法             | 签名                                                  | 说明                             |
| ---------------- | ----------------------------------------------------- | -------------------------------- |
| `addProtocol`    | `(protocol: string, handler: IProtocolHandler): void` | **静态方法**，注册自定义数据协议 |
| `removeProtocol` | `(protocol: string): void`                            | **静态方法**，移除自定义数据协议 |
| `getProtocol`    | `(protocol: string): IProtocolHandler`                | 获取注册的数据协议               |

#### 事件方法

| 方法   | 签名                                                     | 说明               |
| ------ | -------------------------------------------------------- | ------------------ |
| `on`   | `(type: string, handle: (...args: any[]) => void): void` | 注册事件监听       |
| `once` | `(type: string, handle: (...args: any[]) => void): void` | 注册一次性事件监听 |
| `off`  | `(type: string, handle: (...args: any[]) => void): void` | 移除事件监听       |
| `emit` | `(type: string, ...args: any[]): void`                   | 触发事件           |

#### 其他方法

| 方法                  | 签名                | 说明         |
| --------------------- | ------------------- | ------------ |
| `getServiceContainer` | `(): L7Container`   | 获取服务容器 |
| `getDebugService`     | `(): IDebugService` | 获取调试服务 |
| `destroy`             | `(): void`          | 销毁场景     |

#### Scene 事件列表

| 事件名       | 说明         |
| ------------ | ------------ |
| `loaded`     | 场景加载完成 |
| `fontloaded` | 字体加载完成 |
| `maploaded`  | 地图加载完成 |
| `resize`     | 窗口大小变化 |
| `destroy`    | 场景销毁     |
| `dragstart`  | 拖拽开始     |
| `dragging`   | 拖拽中       |
| `dragend`    | 拖拽结束     |
| `dragcancel` | 拖拽取消     |

#### BoxSelect 事件

| 事件名           | 说明     |
| ---------------- | -------- |
| `boxselectstart` | 框选开始 |
| `boxselecting`   | 框选中   |
| `boxselectend`   | 框选结束 |

---

## 2. Source 模块

**导入路径**: `@antv/l7-source` 或通过 `@antv/l7`

```typescript
import Source from '@antv/l7-source';
// or
import { Source } from '@antv/l7';
```

### Source 类

```typescript
const source = new Source(data: any, cfg?: ISourceCFG);
```

#### 属性

| 属性             | 类型                           | 说明              |
| ---------------- | ------------------------------ | ----------------- |
| `type`           | `string`                       | 固定为 `'source'` |
| `isTile`         | `boolean`                      | 是否瓦片数据源    |
| `inited`         | `boolean`                      | 是否初始化完成    |
| `data`           | `IParserData`                  | 解析后的数据      |
| `center`         | `[number, number]`             | 数据中心点        |
| `extent`         | `BBox`                         | 数据范围          |
| `parser`         | `IParserCfg \| ITileParserCFG` | 解析器配置        |
| `transforms`     | `ITransform[]`                 | 数据变换配置      |
| `cluster`        | `boolean`                      | 是否启用聚合      |
| `clusterOptions` | `Partial<IClusterOptions>`     | 聚合选项          |
| `tileset`        | `TilesetManager \| undefined`  | 瓦片数据管理器    |

#### 方法

| 方法                          | 签名                                                                   | 说明                  |
| ----------------------------- | ---------------------------------------------------------------------- | --------------------- |
| `getSourceCfg`                | `(): Partial<ISourceCFG>`                                              | 获取数据源配置        |
| `getParserType`               | `(): string`                                                           | 获取解析器类型        |
| `setData`                     | `(data: any, options?: ISourceCFG): void`                              | 更新数据              |
| `getClusters`                 | `(zoom: number): any`                                                  | 获取聚合数据          |
| `getClustersLeaves`           | `(id: number): any`                                                    | 获取聚合子元素        |
| `updateClusterData`           | `(zoom: number): void`                                                 | 更新聚合数据          |
| `getFeatureById`              | `(id: number): unknown`                                                | 根据 ID 获取要素      |
| `updateFeaturePropertiesById` | `(id: number, properties: Record<string, any>): void`                  | 更新要素属性          |
| `getFeatureId`                | `(field: string, value: any): number \| undefined`                     | 根据字段值获取要素 ID |
| `reloadAllTile`               | `(): void`                                                             | 重新加载所有瓦片      |
| `reloadTilebyId`              | `(z: number, x: number, y: number): void`                              | 按 z/x/y 重载瓦片     |
| `reloadTileByLnglat`          | `(lng: number, lat: number, z: number): void`                          | 按经纬度重载瓦片      |
| `getTileExtent`               | `(e: [number,number,number,number], zoom: number): Array \| undefined` | 获取瓦片范围          |
| `getTileByZXY`                | `(z: number, x: number, y: number): SourceTile \| undefined`           | 按 Z/X/Y 获取瓦片     |
| `reloadTileByExtent`          | `(bounds: [number,number,number,number], z: number): void`             | 按范围重载瓦片        |
| `destroy`                     | `(): void`                                                             | 销毁数据源            |

#### 事件

| 事件     | 说明                                                       |
| -------- | ---------------------------------------------------------- |
| `update` | 数据更新事件，`{ type: 'inited' }` 或 `{ type: 'update' }` |

### 解析器 (Parsers)

所有解析器通过 `parser` 配置项进行选择：

| 解析器类型     | parser.type    | 数据格式                                                | 配置项                                                                                                                                                                                                                     |
| -------------- | -------------- | ------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **GeoJSON**    | `'geojson'`    | `FeatureCollection`                                     | `{ type: 'geojson', featureId?: string }`                                                                                                                                                                                  |
| **JSON**       | `'json'`       | `Array<Object>`                                         | `{ type: 'json', x?: string, y?: string, x1?: string, y1?: string, coordinates?: string, geometry?: string }`                                                                                                              |
| **CSV**        | `'csv'`        | CSV 字符串                                              | `{ type: 'csv', x?: string, y?: string, x1?: string, y1?: string, coordinates?: string, geometry?: string }`                                                                                                               |
| **Image**      | `'image'`      | `string \| string[] \| HTMLImageElement \| ImageBitmap` | `{ type: 'image', extent?: [number,number,number,number], coordinates?: [[number,number],[number,number],[number,number],[number,number]], requestParameters?: object }`                                                   |
| **Raster**     | `'raster'`     | `number[] \| IRasterFileData \| IRasterFileData[]`      | `{ type: 'raster', extent?: [number,number,number,number], coordinates?: [...], width: number, height: number, min?: number, max?: number, format?: IRasterFormat, operation?: IBandsOperation }`                          |
| **RasterTile** | `'rasterTile'` | `string \| string[] \| ITileBand[]`                     | `{ type: 'rasterTile', dataType?: RasterTileType, extent?: [...], zoomOffset?: number, minZoom?: number, maxZoom?: number, tileSize?: number, format?: IRasterFormat, operation?: IBandsOperation }`                       |
| **MVT**        | `'mvt'`        | Vector Tile URL                                         | `{ type: 'mvt', extent?: [...], zoomOffset?: number, minZoom?: number, maxZoom?: number, tileSize?: number, sourceLayer?: string }`                                                                                        |
| **GeoJSONVT**  | `'geojsonvt'`  | GeoJSON FeatureCollection                               | `{ type: 'geojsonvt', extent?: [...], zoomOffset?: number, minZoom?: number, maxZoom?: number, tileSize?: number, maxZoom?: number, indexMaxZoom?: number, indexMaxPoints?: number, tolerance?: number, buffer?: number }` |
| **JSON Tile**  | `'jsonTile'`   | JSON Tile URL                                           | `{ type: 'jsonTile', zoomOffset?: number, minZoom?: number, maxZoom?: number, tileSize?: number, requestParameters?: object }`                                                                                             |
| **RasterRgb**  | `'rasterRgb'`  | `number[] \| IRasterFileData \| IRasterFileData[]`      | 同 raster 类型                                                                                                                                                                                                             |
| **RGB**        | `'rgb'`        | `RasterDataType[]`                                      | `{ type: 'rgb', extent?: [...], width: number, height: number, bands?: [number,number,number], countCut?: [number,number], RMinMax?: [number,number], GMinMax?: [number,number], BMinMax?: [number,number] }`              |
| **NDI**        | `'ndi'`        | `RasterDataType[]`                                      | `{ type: 'ndi', extent?: [...], width: number, height: number, bands?: [number,number] }`                                                                                                                                  |
| **TestTile**   | `'testTile'`   | -                                                       | 内部测试用                                                                                                                                                                                                                 |

### 数据变换 (Transforms)

通过 `transforms` 配置项进行数据变换：

| 变换类型    | 说明     | 配置项                                                                                                                                                                       |
| ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `'cluster'` | 聚合     | `{ type: 'cluster', radius?: number, maxZoom?: number, minZoom?: number, zoom?: number, method?: 'count' \| 'sum' \| 'max' \| 'min' \| 'mean' \| Function, field?: string }` |
| `'filter'`  | 数据过滤 | `{ type: 'filter', callback: (item) => boolean }`                                                                                                                            |
| `'join'`    | 数据关联 | `{ type: 'join', sourceField: string, targetField: string, data: any[] }`                                                                                                    |
| `'map'`     | 数据映射 | `{ type: 'map', callback: (item) => item }`                                                                                                                                  |
| `'grid'`    | 网格聚合 | `{ type: 'grid', size?: number, method?: 'sum' \| 'max' \| 'min' \| 'mean', field?: string }`                                                                                |
| `'hexagon'` | 蜂窝聚合 | `{ type: 'hexagon', size?: number, method?: 'sum' \| 'max' \| 'min' \| 'mean', field?: string }`                                                                             |

### 工厂函数

```typescript
import { getParser, registerParser, getTransform, registerTransform } from '@antv/l7-source';

registerParser(type: string, parserFunction: (data: any, cfg?: any) => IParserData): void
registerTransform(type: string, transformFunction: (data: IParserData, cfg?: any) => IParserData): void
getParser(type: string): ParserFunction
getTransform(type: string): TransformFunction
```

### 关键接口

```typescript
// 解析后数据项
interface IParseDataItem {
  coordinates: any[];
  _id: number;
  [key: string]: any;
}

// 解析后数据
interface IParserData {
  dataArray: IParseDataItem[];
  featureKeys?: IFeatureKey;
  [key: string]: any;
}

// Raster 数据
interface IRasterData {
  rasterData: HTMLImageElement | Uint8Array | ImageBitmap | null | undefined;
  width: number;
  height: number;
}

// Raster 配置
interface IRasterCfg {
  format?: IRasterFormat;
  operation?: IBandsOperation;
  extent?: [number, number, number, number];
  coordinates?: [[number, number], [number, number], [number, number], [number, number]];
  width: number;
  height: number;
  max: number;
  min: number;
}
```

---

## 3. Map 模块

**导入路径**: `@antv/l7-maps` 或 `@antv/l7`

```typescript
import {
  GaodeMap,
  Mapbox,
  MapLibre,
  BaiduMap,
  GoogleMap,
  TencentMap,
  TMap,
  Map,
  Earth,
} from '@antv/l7';
```

### 支持的地图类型

| 地图类                | 说明                      | 类型标识           |
| --------------------- | ------------------------- | ------------------ |
| `GaodeMap`            | 高德地图 V2               | `'amap'`           |
| `GaodeMapV1`          | **已废弃**，指向 GaodeMap | `'amap'`           |
| `GaodeMapV2`          | **已废弃**，指向 GaodeMap | `'amap'`           |
| `Mapbox`              | Mapbox GL JS              | `'mapbox'`         |
| `MapLibre`            | MapLibre GL JS            | `'mapbox'`         |
| `BaiduMap`            | 百度地图                  | `'bmap'`           |
| `GoogleMap`           | Google Maps               | `'gmap'`           |
| `TMap` / `TencentMap` | 天地图 / 腾讯地图         | `'tdt'` / `'tmap'` |
| `Map`                 | L7 内置地图(无底图)       | `'default'`        |
| `Earth`               | 地球模式                  | -                  |
| `MercatorCoordinate`  | 墨卡托坐标转换工具        | -                  |
| `SimpleMapCoord`      | 简单坐标系                | -                  |
| `MapMouseEvent`       | 地图鼠标事件              | -                  |
| `Viewport`            | Web Mercator 视口         | -                  |

### Map (内置地图) 配置项 - MapOptions

| 属性                  | 类型                             | 默认值   | 说明                 |
| --------------------- | -------------------------------- | -------- | -------------------- |
| `version`             | `string`                         | -        | 地图类型版本         |
| `mapSize`             | `number`                         | `10000`  | 简易地图大小         |
| `interactive`         | `boolean`                        | `true`   | 是否启用交互         |
| `container`           | `HTMLElement \| string`          | -        | **必填**，容器元素   |
| `bearingSnap`         | `number`                         | `7`      | 旋转吸附角度阈值     |
| `maxBounds`           | `LngLatBoundsLike`               | -        | 最大边界限制         |
| `scrollZoom`          | `boolean \| AroundCenterOptions` | `true`   | 是否允许滚动缩放     |
| `minZoom`             | `number \| null`                 | `0`      | 最小缩放             |
| `maxZoom`             | `number \| null`                 | `22`     | 最大缩放             |
| `minPitch`            | `number \| null`                 | `0`      | 最小倾斜角           |
| `maxPitch`            | `number \| null`                 | `60`     | 最大倾斜角           |
| `boxZoom`             | `boolean`                        | `true`   | 是否启用框选缩放     |
| `dragRotate`          | `boolean`                        | `true`   | 是否允许拖拽旋转     |
| `dragPan`             | `boolean \| DragPanOptions`      | `true`   | 是否允许拖拽平移     |
| `keyboard`            | `boolean \| KeyboardOptions`     | `true`   | 是否启用键盘操作     |
| `doubleClickZoom`     | `boolean`                        | `true`   | 是否启用双击缩放     |
| `touchZoomRotate`     | `boolean \| AroundCenterOptions` | `true`   | 是否启用触摸缩放旋转 |
| `touchPitch`          | `boolean \| AroundCenterOptions` | `true`   | 是否启用触摸倾斜     |
| `cooperativeGestures` | `boolean \| GestureOptions`      | `false`  | 协作式手势           |
| `center`              | `LngLatLike`                     | `[0, 0]` | 初始中心点           |
| `zoom`                | `number`                         | `0`      | 初始缩放级别         |
| `bearing`             | `number`                         | `0`      | 初始旋转角度         |
| `pitch`               | `number`                         | `0`      | 初始倾斜角度         |
| `style`               | `any`                            | -        | 地图样式             |

### 高德地图（GaodeMap）专属配置

| 属性          | 类型       | 默认值    | 说明               |
| ------------- | ---------- | --------- | ------------------ |
| `token`       | `string`   | -         | 高德地图 API Key   |
| `mapInstance` | `AMap.Map` | -         | 复用已有地图实例   |
| `plugin`      | `string[]` | `[]`      | 需要加载的插件列表 |
| `style`       | `string`   | `'light'` | 地图样式名称       |

---

## 4. Component 模块

**导入路径**: `@antv/l7-component` 或 `@antv/l7`

```typescript
import {
  Zoom,
  Scale,
  Logo,
  Fullscreen,
  GeoLocate,
  LayerSwitch,
  MouseLocation,
  MapTheme,
  Swipe,
  Marker,
  MarkerLayer,
  Popup,
  LayerPopup,
  ExportImage,
} from '@antv/l7';
```

### 4.1 Control 控件

所有控件继承自 `Control` 基类。

#### Control 基类公共方法

| 方法           | 签名                                  | 说明          |
| -------------- | ------------------------------------- | ------------- |
| `addTo`        | `(sceneContainer: L7Container): this` | 添加到场景    |
| `remove`       | `(): this`                            | 从场景移除    |
| `show`         | `(): void`                            | 显示控件      |
| `hide`         | `(): void`                            | 隐藏控件      |
| `getOptions`   | `(): O`                               | 获取配置项    |
| `setOptions`   | `(newOptions: Partial<O>): void`      | 更新配置项    |
| `getContainer` | `(): HTMLElement`                     | 获取 DOM 容器 |
| `getIsShow`    | `(): boolean`                         | 是否显示      |
| `setPosition`  | `(position: PositionName): void`      | 设置位置      |
| `setClassName` | `(className: string): void`           | 设置 CSS 类名 |
| `setStyle`     | `(style: string): void`               | 设置内联样式  |

#### IControlOption 通用配置项

| 属性        | 类型                      | 默认值       | 说明            |
| ----------- | ------------------------- | ------------ | --------------- |
| `name`      | `string`                  | 自增         | 控件名称        |
| `position`  | `PositionName \| Element` | `'topright'` | 控件位置        |
| `className` | `string`                  | -            | 自定义 CSS 类名 |
| `style`     | `string`                  | -            | 自定义内联样式  |

**PositionName 枚举值**: `'topleft'` | `'topright'` | `'bottomleft'` | `'bottomright'`

---

### Zoom 缩放控件

```typescript
new Zoom(option?: Partial<IZoomControlOption>)
```

| 属性           | 类型               | 默认值       | 说明                 |
| -------------- | ------------------ | ------------ | -------------------- |
| `zoomInText`   | `ELType \| string` | 放大图标     | 放大按钮文本/图标    |
| `zoomInTitle`  | `string`           | `'Zoom in'`  | 放大按钮标题         |
| `zoomOutText`  | `ELType \| string` | 缩小图标     | 缩小按钮文本/图标    |
| `zoomOutTitle` | `string`           | `'Zoom out'` | 缩小按钮标题         |
| `showZoom`     | `boolean`          | `false`      | 是否显示当前缩放级别 |

额外方法: `disable()`, `enable()`, `zoomIn()`, `zoomOut()`

---

### Scale 比例尺控件

```typescript
new Scale(option?: Partial<IScaleControlOption>)
```

| 属性             | 类型      | 默认值  | 说明                 |
| ---------------- | --------- | ------- | -------------------- |
| `maxWidth`       | `number`  | `100`   | 最大宽度(像素)       |
| `metric`         | `boolean` | `true`  | 是否显示公制单位     |
| `imperial`       | `boolean` | `false` | 是否显示英制单位     |
| `updateWhenIdle` | `boolean` | `false` | 是否在移动结束时更新 |
| `lockWidth`      | `boolean` | `true`  | 是否锁定宽度         |

---

### Logo 控件

```typescript
new Logo(option?: Partial<ILogoControlOption>)
```

| 属性   | 类型             | 默认值      | 说明                        |
| ------ | ---------------- | ----------- | --------------------------- |
| `img`  | `string`         | L7 Logo URL | Logo 图片地址               |
| `href` | `string \| null` | L7 官网     | 点击跳转链接，null 则不跳转 |

---

### Fullscreen 全屏控件

```typescript
new Fullscreen(option?: Partial<IFullscreenControlOption>)
```

继承 `ButtonControl`，额外配置:

| 属性          | 类型     | 默认值       | 说明             |
| ------------- | -------- | ------------ | ---------------- |
| `exitBtnText` | `string` | -            | 退出全屏按钮文本 |
| `exitBtnIcon` | `ELType` | 退出全屏图标 | 退出全屏按钮图标 |
| `exitTitle`   | `string` | `'退出全屏'` | 退出全屏标题     |

方法: `toggleFullscreen()`, 事件: `'fullscreenChange'`

---

### GeoLocate 定位控件

```typescript
new GeoLocate(option?: Partial<IGeoLocateOption>)
```

继承 `ButtonControl`，额外配置:

| 属性        | 类型                                           | 默认值 | 说明         |
| ----------- | ---------------------------------------------- | ------ | ------------ |
| `transform` | `(position: Point) => Point \| Promise<Point>` | -      | 坐标转换函数 |

方法: `getGeoLocation(): Promise<Point>`

---

### LayerSwitch 图层切换控件

```typescript
new LayerSwitch(option?: Partial<ILayerSwitchOption>)
```

继承 `SelectControl`，配置:

| 属性       | 类型                                         | 默认值 | 说明         |
| ---------- | -------------------------------------------- | ------ | ------------ |
| `layers`   | `Array<ILayer \| string \| LayerSwitchItem>` | `[]`   | 图层列表     |
| `multiple` | `boolean`                                    | `true` | 是否允许多选 |

`LayerSwitchItem`: `{ layer: ILayer, name?: string, img?: string }`

---

### MouseLocation 鼠标位置控件

```typescript
new MouseLocation(option?: Partial<IMouseLocationControlOption>)
```

| 属性        | 类型                               | 默认值         | 说明         |
| ----------- | ---------------------------------- | -------------- | ------------ |
| `transform` | `(position: Position) => Position` | 六位小数格式化 | 坐标转换函数 |

方法: `getLocation(): Position`  
事件: `'locationChange'`

---

### MapTheme 主题切换控件

```typescript
new MapTheme(option?: Partial<ISelectControlOption>)
```

继承 `SelectControl`，根据当前地图类型自动列举可用样式。

---

### Swipe 卷帘控件

```typescript
new Swipe(option?: Partial<ISwipeControlOption>)
```

| 属性          | 类型                         | 默认值       | 说明           |
| ------------- | ---------------------------- | ------------ | -------------- |
| `layers`      | `ILayer[]`                   | `[]`         | 左侧图层       |
| `rightLayers` | `ILayer[]`                   | `[]`         | 右侧图层       |
| `ratio`       | `number`                     | `0.5`        | 卷帘位置 (0-1) |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | 卷帘方向       |

---

### ExportImage 导出图片控件

```typescript
new ExportImage(option?: Partial<IExportImageControlOption>)
```

继承 `ButtonControl`，配置:

| 属性        | 类型                       | 默认值  | 说明         |
| ----------- | -------------------------- | ------- | ------------ |
| `imageType` | `'png' \| 'jpeg'`          | `'png'` | 导出图片格式 |
| `onExport`  | `(base64: string) => void` | -       | 导出回调     |

方法: `getImage(): Promise<string>`

---

### 4.2 Popup 气泡组件

#### Popup

```typescript
new Popup(option?: Partial<IPopupOption>)
```

| 属性                 | 类型               | 默认值    | 说明             |
| -------------------- | ------------------ | --------- | ---------------- |
| `closeButton`        | `boolean`          | `true`    | 是否显示关闭按钮 |
| `closeButtonOffsets` | `[number, number]` | -         | 关闭按钮偏移     |
| `closeOnClick`       | `boolean`          | `true`    | 点击地图是否关闭 |
| `closeOnEsc`         | `boolean`          | `false`   | 按 Esc 是否关闭  |
| `maxWidth`           | `string`           | `'240px'` | 最大宽度         |
| `anchor`             | `anchorType`       | -         | 气泡锚点位置     |
| `offsets`            | `[number, number]` | `[0, 0]`  | 偏移量           |
| `stopPropagation`    | `boolean`          | `true`    | 是否阻止事件冒泡 |
| `autoPan`            | `boolean`          | `true`    | 是否自动平移地图 |
| `autoClose`          | `boolean`          | `true`    | 是否自动关闭     |
| `followCursor`       | `boolean`          | `false`   | 是否跟随光标     |
| `className`          | `string`           | -         | 自定义 CSS 类名  |
| `style`              | `string`           | -         | 自定义内联样式   |
| `lngLat`             | `ILngLat`          | -         | 气泡经纬度位置   |
| `html`               | `ElementType`      | -         | HTML 内容        |
| `text`               | `string`           | -         | 纯文本内容       |
| `title`              | `ElementType`      | -         | 标题内容         |

方法:

- `addTo(scene: L7Container): this`
- `remove(): this`
- `open(): this`
- `close(): this`
- `show(): this`
- `hide(): this`
- `setLnglat(lngLat: ILngLat): this`
- `getLnglat(): ILngLat`
- `setHTML(html: ElementType): this`
- `setText(text: string): this`
- `setTitle(title?: ElementType): this`
- `setOptions(option: Partial<IPopupOption>): this`
- `isOpen(): boolean`

#### LayerPopup

```typescript
new LayerPopup(option?: Partial<ILayerPopupOption>)
```

继承 `Popup`，额外配置:

| 属性               | 类型                                               | 默认值    | 说明         |
| ------------------ | -------------------------------------------------- | --------- | ------------ |
| `config` / `items` | `LayerPopupConfigItem[]`                           | `[]`      | 图层弹窗配置 |
| `trigger`          | `'hover' \| 'click' \| 'touchend' \| 'touchstart'` | `'hover'` | 触发方式     |

`LayerPopupConfigItem`:

```typescript
{
  layer: ILayer | string;
  fields?: Array<LayerField | string>;
  title?: ElementType | ((feature: any) => ElementType);
  customContent?: ElementType | ((feature: any) => ElementType);
}
```

`LayerField`:

```typescript
{
  field: string;
  formatField?: ElementType | ((field: string, feature: any) => ElementType);
  formatValue?: ElementType | ((value: any, feature: any) => ElementType);
  getValue?: (feature: any) => any;
}
```

---

### 4.3 Marker 标注组件

#### Marker

```typescript
new Marker(option?: Partial<IMarkerOption>)
```

| 属性           | 类型                       | 默认值      | 说明             |
| -------------- | -------------------------- | ----------- | ---------------- |
| `element`      | `HTMLElement \| undefined` | `undefined` | 自定义 DOM 元素  |
| `anchor`       | `anchorType`               | `'bottom'`  | 锚点位置         |
| `color`        | `string`                   | `'#5B8FF9'` | 默认标记颜色     |
| `offsets`      | `number[]`                 | `[0, 0]`    | 偏移量           |
| `draggable`    | `boolean`                  | `false`     | 是否可拖拽       |
| `overflowHide` | `boolean`                  | `true`      | 超出可视区时隐藏 |
| `extData`      | `any`                      | -           | 自定义数据       |
| `style`        | `CSSStyleDeclaration`      | -           | 自定义样式       |

方法:

- `addTo(scene: L7Container): this`
- `remove(): this`
- `show(): this`
- `hide(): this`
- `setLnglat(lngLat: ILngLat \| IPoint): this`
- `getLnglat(): ILngLat`
- `getElement(): HTMLElement`
- `setElement(el: HTMLElement): this`
- `openPopup(): this`
- `closePopup(): this`
- `setPopup(popup: IPopup): this`
- `togglePopup(): this`
- `getPopup(): IPopup`
- `getOffset(): number[]`
- `setDraggable(draggable: boolean): void`
- `getDraggable(): boolean`
- `getExtData(): any`
- `setExtData(data: any): void`

事件: `'dragstart'`, `'dragging'`, `'dragend'`, `'added'`

#### MarkerLayer

```typescript
new MarkerLayer(option?: Partial<IMarkerLayerOption>)
```

| 属性            | 类型                             | 默认值  | 说明             |
| --------------- | -------------------------------- | ------- | ---------------- |
| `cluster`       | `boolean`                        | `false` | 是否启用聚合     |
| `clusterOption` | `Partial<IMarkerStyleOption>`    | 见下方  | 聚合选项         |
| `markerOption`  | `{ color?, style?, className? }` | -       | 默认 Marker 选项 |

`IMarkerStyleOption`:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `element` | `Function` | - | 聚合元素生成函数 |
| `style` | `object \| Function` | `{}` | 聚合样式 |
| `className` | `string` | `''` | 自定义类名 |
| `field` | `string` | - | 聚合统计字段 |
| `method` | `'sum' \| 'max' \| 'min' \| 'mean'` | `'sum'` | 统计方法 |
| `radius` | `number` | `80` | 聚合半径 |
| `maxZoom` | `number` | `20` | 最大聚合级别 |
| `minZoom` | `number` | `0` | 最小聚合级别 |
| `zoom` | `number` | `-99` | 当前缩放级别 |

方法:

- `addTo(scene: L7Container): this`
- `addMarker(marker: IMarker): void`
- `getMarkers(): IMarker[]`
- `removeMarker(marker: IMarker): void`
- `clear(): void`
- `destroy(): void`

---

## 5. Layers 模块

**导入路径**: `@antv/l7-layers` 或 `@antv/l7`

```typescript
import {
  PointLayer,
  LineLayer,
  PolygonLayer,
  HeatmapLayer,
  ImageLayer,
  RasterLayer,
  MaskLayer,
  TileLayer,
  TileDebugLayer,
  CityBuildingLayer,
  WindLayer,
  CanvasLayer,
  EarthLayer,
  GeometryLayer,
  BaseLayer,
  BaseModel,
} from '@antv/l7';
```

### BaseLayer 公共 API

所有图层均继承自 `BaseLayer`，以下为公共 API：

#### 属性

| 属性        | 类型                     | 说明               |
| ----------- | ------------------------ | ------------------ |
| `id`        | `string`                 | 图层唯一 ID (自增) |
| `name`      | `string`                 | 图层名称           |
| `type`      | `string`                 | 图层类型           |
| `visible`   | `boolean`                | 是否可见           |
| `zIndex`    | `number`                 | 图层层级           |
| `minZoom`   | `number`                 | 最小可见缩放       |
| `maxZoom`   | `number`                 | 最大可见缩放       |
| `inited`    | `boolean`                | 是否初始化完成     |
| `tileLayer` | `TileLayer \| undefined` | 瓦片图层实例       |

#### 链式配置方法

| 方法      | 签名                                                                  | 说明               |
| --------- | --------------------------------------------------------------------- | ------------------ |
| `source`  | `(data: any, options?: ISourceCFG): ILayer`                           | 设置数据源         |
| `shape`   | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置形状           |
| `color`   | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置颜色           |
| `size`    | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置大小           |
| `rotate`  | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置旋转           |
| `texture` | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置纹理           |
| `filter`  | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置过滤           |
| `label`   | `(field: StyleAttributeField, values?: StyleAttributeOption): ILayer` | 设置标签           |
| `animate` | `(options: IAnimateOption \| boolean): ILayer`                        | 设置动画           |
| `style`   | `(options: Partial<StyleOptions & ILayerConfig>): ILayer`             | 设置样式           |
| `scale`   | `(field: string \| object, cfg?: any): ILayer`                        | 设置数据映射比例尺 |

#### 交互方法

| 方法        | 签名                                                                  | 说明          |
| ----------- | --------------------------------------------------------------------- | ------------- |
| `active`    | `(options: IActiveOption \| boolean): ILayer`                         | 开启/设置高亮 |
| `setActive` | `(id: number \| {x:number, y:number}, options?: IActiveOption): void` | 设置高亮元素  |
| `select`    | `(options: IActiveOption \| boolean): ILayer`                         | 开启/设置选中 |
| `setSelect` | `(id: number \| {x:number, y:number}, options?: IActiveOption): void` | 设置选中元素  |
| `pick`      | `({x, y}: {x: number, y: number}): void`                              | 拾取元素      |
| `boxSelect` | `(box: [number,number,number,number], cb: Function): void`            | 框选          |

**IActiveOption**:

```typescript
interface IActiveOption {
  color?: string; // 高亮/选中颜色
  mix?: number; // 混合比例
}
```

#### 显示/隐藏/层级

| 方法         | 签名                                   | 说明           |
| ------------ | -------------------------------------- | -------------- |
| `show`       | `(): ILayer`                           | 显示图层       |
| `hide`       | `(): ILayer`                           | 隐藏图层       |
| `setIndex`   | `(index: number): ILayer`              | 设置 z-index   |
| `setMinZoom` | `(minZoom: number): ILayer`            | 设置最小缩放   |
| `setMaxZoom` | `(maxZoom: number): ILayer`            | 设置最大缩放   |
| `getMinZoom` | `(): number`                           | 获取最小缩放   |
| `getMaxZoom` | `(): number`                           | 获取最大缩放   |
| `isVisible`  | `(): boolean`                          | 是否可见       |
| `setAutoFit` | `(autoFit: boolean): ILayer`           | 设置自动适配   |
| `fitBounds`  | `(fitBoundsOptions?: unknown): ILayer` | 缩放到数据范围 |
| `setBlend`   | `(type: keyof BlendType): ILayer`      | 设置混合模式   |

#### 数据方法

| 方法             | 签名                                      | 说明         |
| ---------------- | ----------------------------------------- | ------------ |
| `setData`        | `(data: any, options?: ISourceCFG): void` | 更新数据     |
| `getSource`      | `(): Source`                              | 获取数据源   |
| `setSource`      | `(source: Source): void`                  | 设置数据源   |
| `getEncodedData` | `(): IEncodeFeature[]`                    | 获取编码数据 |
| `setEncodedData` | `(encodedData: IEncodeFeature[]): void`   | 设置编码数据 |

#### 配置方法

| 方法                | 签名                                                                    | 说明           |
| ------------------- | ----------------------------------------------------------------------- | -------------- |
| `getLayerConfig`    | `<T = any>(): Partial<ILayerConfig & T>`                                | 获取图层配置   |
| `updateLayerConfig` | `(configToUpdate: Partial<ILayerConfig>): void`                         | 更新图层配置   |
| `setMultiPass`      | `(enable: boolean, passes?: Array<string \| [string, object]>): ILayer` | 设置多通道渲染 |

#### 渲染方法

| 方法           | 签名                                          | 说明         |
| -------------- | --------------------------------------------- | ------------ |
| `render`       | `(options?: Partial<IRenderOptions>): ILayer` | 渲染图层     |
| `renderLayers` | `(): void`                                    | 渲染所有图层 |
| `clear`        | `(): void`                                    | 清除图层     |
| `clearModels`  | `(): void`                                    | 清除模型     |
| `destroy`      | `(refresh?: boolean): void`                   | 销毁图层     |

#### Mask 方法

| 方法          | 签名                    | 说明     |
| ------------- | ----------------------- | -------- |
| `addMask`     | `(layer: ILayer): void` | 添加蒙层 |
| `removeMask`  | `(layer: ILayer): void` | 移除蒙层 |
| `enableMask`  | `(): void`              | 启用蒙层 |
| `disableMask` | `(): void`              | 禁用蒙层 |

#### 图例方法

| 方法             | 签名                          | 说明       |
| ---------------- | ----------------------------- | ---------- |
| `getLegend`      | `(name: string): ILegend`     | 获取图例   |
| `getLegendItems` | `(name: string): LegendItems` | 获取图例项 |
| `getScale`       | `(name: string): any`         | 获取比例尺 |

#### 事件

| 事件          | 说明             |
| ------------- | ---------------- |
| `inited`      | 图层初始化完成   |
| `add`         | 图层添加         |
| `show`        | 图层显示         |
| `hide`        | 图层隐藏         |
| `remove`      | 图层移除         |
| `destroy`     | 图层销毁         |
| `mousemove`   | 鼠标移动         |
| `mouseout`    | 鼠标移出         |
| `mouseenter`  | 鼠标进入         |
| `click`       | 点击             |
| `dblclick`    | 双击             |
| `unmousemove` | 取消鼠标移动高亮 |
| `unclick`     | 取消点击选中     |
| `undblclick`  | 取消双击选中     |

#### 生命周期钩子 (Hooks)

| Hook                  | 说明       |
| --------------------- | ---------- |
| `init`                | 初始化     |
| `afterInit`           | 初始化完成 |
| `beforeRender`        | 渲染前     |
| `beforeRenderData`    | 渲染数据前 |
| `afterRender`         | 渲染后     |
| `beforePickingEncode` | 拾取编码前 |
| `afterPickingEncode`  | 拾取编码后 |
| `beforeHighlight`     | 高亮前     |
| `afterHighlight`      | 高亮后     |
| `beforeSelect`        | 选中前     |
| `afterSelect`         | 选中后     |
| `beforeDestroy`       | 销毁前     |
| `afterDestroy`        | 销毁后     |

---

### 图层类型详情

#### PointLayer (点图层)

```typescript
new PointLayer(option?: Partial<ILayerConfig & IPointLayerStyleOptions>)
```

**type**: `'PointLayer'`  
**默认数据解析**: `{ type: 'json', x: 'lng', y: 'lat' }`  
**shape**: `'circle'` | `'square'` | `'triangle'` | `'pentagon'` | `'hexagon'` | `'octagon'` | `'diamond'` | `'hexagon'` | `'image'` | `'text'` | `'cylinder'` | ...

**IPointLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `opacity` | `number` | 整体透明度 |
| `strokeOpacity` | `number` | 描边透明度 |
| `strokeWidth` | `number` | 描边宽度 |
| `stroke` | `string` | 描边颜色 |
| `blur` | `number` | 模糊度 |
| `billboard` | `boolean` | 图片是否始终朝向相机 |
| `textOffset` | `[number, number]` | 文本偏移 |
| `textAnchor` | `anchorType` | 文本锚点 |
| `spacing` | `number` | 字间距 |
| `padding` | `[number, number]` | 文本内边距 |
| `halo` | `number` | 文本光晕 |
| `gamma` | `number` | 文本伽马 |
| `fontWeight` | `string` | 字体粗细 |
| `fontFamily` | `string` | 字体 |
| `textAllowOverlap` | `boolean` | 文本是否允许重叠 |
| `allowOverlap` | `boolean` | 图标是否允许压盖 |
| `pickLight` | `boolean` | 是否开启光照拾取 |
| `sourceColor` | `string` | 渐变起始色 |
| `targetColor` | `string` | 渐变终止色 |
| `opacityLinear` | `{enable: boolean, dir: string}` | 线性透明度 |
| `lightEnable` | `boolean` | 是否开启光照 |
| `offsets` | `[number, number]` | 偏移量 |
| `unit` | `SizeUnitType` | 尺寸单位 (pixel/meter) |
| `rotation` | `number` | 旋转角度 |
| `speed` | `number` | 速度 |
| `featureId` | `string` | 要素 ID 字段 |
| `sourceLayer` | `string` | 瓦片源图层名 |

---

#### LineLayer (线图层)

```typescript
new LineLayer(option?: Partial<ILayerConfig & ILineLayerStyleOptions>)
```

**type**: `'LineLayer'`  
**shape**: `'line'` | `'arc'` | `'arc3d'` | `'greatcircle'` | `'wall'` | `'flowline'` | `'arrow'` | `'dash'` | ...

**ILineLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `lineType` | `'solid' \| 'dash'` | 线类型 |
| `dashArray` | `[number, number]` | 虚线间隔 |
| `segmentNumber` | `number` | 弧线段数 |
| `forward` | `boolean` | 是否反向 (arcLine) |
| `lineTexture` | `boolean` | 是否开启纹理 |
| `iconStep` | `number` | 纹理步长 |
| `iconStepCount` | `number` | 纹理间隔 |
| `textureBlend` | `TextureBlend` | 纹理混合模式 |
| `linearDir` | `LinearDir` | 渐变方向 |
| `sourceColor` | `string` | 渐变起始色 |
| `targetColor` | `string` | 渐变终止色 |
| `thetaOffset` | `number` | 弧线偏移量 |
| `globalArcHeight` | `number` | 地球模式弧线高度 |
| `vertexHeightScale` | `number` | 顶点高度缩放 |
| `borderWidth` | `number` | 线边框宽度 |
| `borderColor` | `string` | 线边框颜色 |
| `strokeWidth` | `number` | 描边宽度 |
| `stroke` | `string` | 描边颜色 |
| `blur` | `[number, number, number]` | 模糊分布 |
| `symbol` | `ILineSymbol` | 箭头符号配置 |
| `rampColors` | `IColorRamp` | 色带颜色 |
| `enablePicking` | `boolean` | 是否启用拾取 |
| `workerEnabled` | `boolean` | 是否启用 Worker |

---

#### PolygonLayer (面图层)

```typescript
new PolygonLayer(option?: Partial<ILayerConfig & IPolygonLayerStyleOptions>)
```

**type**: `'PolygonLayer'`  
**默认数据解析**: `{ type: 'geojson' }`  
**shape**: `'fill'` | `'extrude'` | `'extrusion'` | `'water'` | `'ocean'` | `'line'` | 内嵌点形状

**IPolygonLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `opacityLinear` | `{enable: boolean, dir: string}` | 线性透明度 |
| `topsurface` | `boolean` | 是否显示顶面 |
| `sidesurface` | `boolean` | 是否显示侧面 |
| `mapTexture` | `string` | 挤出几何体顶面贴图 |
| `sourceColor` | `string` | 渐变起始色 |
| `targetColor` | `string` | 渐变终止色 |
| `pickLight` | `boolean` | 是否开启光照 |
| `waterTexture` | `string` | 水面纹理 |
| `speed` | `number` | 动画速度 |
| `watercolor` | `string` | 海面颜色1 |
| `watercolor2` | `string` | 海面颜色2 |
| `featureId` | `string` | 要素 ID 字段 |
| `sourceLayer` | `string` | 瓦片源图层名 |

---

#### HeatmapLayer (热力图图层)

```typescript
new HeatmapLayer(option?: Partial<ILayerConfig & IHeatMapLayerStyleOptions>)
```

**type**: `'HeatMapLayer'`  
**shape**: `'heatmap'` | `'hexagon'` | `'grid'` | `'circle'` | ...

**IHeatMapLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `intensity` | `number` | 热力强度 |
| `radius` | `number` | 热力半径 |
| `angle` | `number` | 角度 |
| `rampColors` | `IColorRamp` | 色带颜色 |
| `coverage` | `number` | 覆盖度 |

---

#### ImageLayer (图片图层)

```typescript
new ImageLayer(option?: Partial<ILayerConfig & IImageLayerStyleOptions>)
```

**type**: `'ImageLayer'`

**IImageLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `domain` | `[number, number]` | 值域范围 |
| `noDataValue` | `number` | 无数据值 |
| `clampLow` | `boolean` | 是否限制低值 |
| `clampHigh` | `boolean` | 是否限制高值 |
| `rampColors` | `IColorRamp` | 色带颜色 |
| `colorTexture` | `ITexture2D` | 颜色纹理 |
| `brightness` | `number` | 亮度 |
| `contrast` | `number` | 对比度 |
| `saturation` | `number` | 饱和度 |
| `gamma` | `number` | 伽马值 |

---

#### RasterLayer (栅格图层)

```typescript
new RasterLayer(option?: Partial<ILayerConfig & IRasterLayerStyleOptions>)
```

**type**: `'RasterLayer'`

根据 parser 类型自动选择模型: `'raster'` / `'rasterRgb'` / `'rasterTerrainRgb'`

**IRasterLayerStyleOptions** (继承 `IBaseRasterLayerStyleOptions`):
| 属性 | 类型 | 说明 |
|------|------|------|
| `domain` | `[number, number]` | 值域范围 |
| `noDataValue` | `number` | 无数据值 |
| `clampLow` | `boolean` | 是否限制低值 |
| `clampHigh` | `boolean` | 是否限制高值 |
| `rampColors` | `IColorRamp` | 色带颜色 |
| `colorTexture` | `ITexture2D` | 颜色纹理 |
| `channelRMax` | `number` | R 通道最大值 |
| `channelGMax` | `number` | G 通道最大值 |
| `channelBMax` | `number` | B 通道最大值 |

---

#### MaskLayer (蒙图层)

```typescript
new MaskLayer(option?: Partial<ILayerConfig & IMaskLayerStyleOptions>)
```

**type**: `'MaskLayer'`  
**shape**: `'fill'`

**IMaskLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `opacity` | `number` | 透明度 |
| `color` | `string` | 蒙层颜色 |
| `sourceLayer` | `string` | 瓦片源图层名 |

---

#### TileLayer (瓦片图层)

```typescript
new TileLayer(parent: ILayer)
```

**type**: `'TileLayer'` (包装类，不直接使用)  
瓦片图层由 Source 的 `isTile` 标识自动创建。

主要方法:

- `render(): void` - 渲染瓦片
- `reload(): void` - 重载瓦片
- `destroy(): void` - 销毁

---

#### TileDebugLayer (瓦片调试图层)

用于瓦片调试的图层。

```typescript
new TileDebugLayer(option?: Partial<ILayerConfig>)
```

---

#### CityBuildingLayer (城市建筑图层)

```typescript
new CityBuildingLayer(option?: Partial<ILayerConfig & ICityBuildLayerStyleOptions>)
```

**type**: `'CityBuildingLayer'`

**ICityBuildLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `opacity` | `number` | 透明度 |
| `baseColor` | `string` | 基础颜色 |
| `brightColor` | `string` | 亮面颜色 |
| `windowColor` | `string` | 窗户颜色 |
| `time` | `number` | 时间(动画) |
| `sweep` | `{enable, sweepRadius, sweepColor, sweepSpeed, sweepCenter?}` | 扫描光配置 |

方法: `setLight(t: number): void`

---

#### WindLayer (风场图层)

```typescript
new WindLayer(option?: Partial<ILayerConfig & IWindLayerStyleOptions>)
```

**type**: `'WindLayer'`  
**shape**: `'wind'`

**IWindLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `uMin` | `number` | U 分量最小值 |
| `uMax` | `number` | U 分量最大值 |
| `vMin` | `number` | V 分量最小值 |
| `vMax` | `number` | V 分量最大值 |
| `fadeOpacity` | `number` | 轨迹消失透明度 |
| `speedFactor` | `number` | 速度因子 |
| `dropRate` | `number` | 粒子丢失率 |
| `dropRateBump` | `number` | 粒子丢失率增量 |
| `numParticles` | `number` | 粒子数量 |
| `rampColors` | `{[key: number]: string}` | 色带颜色 |
| `sizeScale` | `number` | 尺寸缩放 |

---

#### CanvasLayer (Canvas 图层)

```typescript
new CanvasLayer(option?: Partial<ILayerConfig & ICanvasLayerOptions>)
```

**type**: `'CanvasLayer'`

**ICanvasLayerOptions**:
| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| `zIndex` | `number` | `3` | 层级 |
| `contextType` | `'canvas2d'` | `'canvas2d'` | Canvas 上下文类型 |
| `getContext` | `(canvas: HTMLCanvasElement) => RenderingContext` | - | 获取上下文函数 |
| `trigger` | `'end' \| 'change'` | `'change'` | 渲染触发时机 |
| `draw` | `(params: ICanvasLayerRenderParams) => void` | - | 绘制回调 |

方法:

- `draw(draw: Function): this` - 设置绘制函数
- `render(): this` - 渲染
- `getCanvas(): HTMLCanvasElement` - 获取 Canvas 元素

---

#### EarthLayer (地球图层)

```typescript
new EarthLayer(option?: Partial<ILayerConfig>)
```

**type**: `'EarthLayer'`  
**shape**: `'base'` | `'atomSphere'` | `'bloomSphere'`

方法: `setEarthTime(time: number): void`

---

#### GeometryLayer (几何图层)

```typescript
new GeometryLayer(option?: Partial<ILayerConfig & IGeometryLayerStyleOptions>)
```

**type**: `'GeometryLayer'`  
**shape**: `'plane'` | `'sprite'` | `'billboard'`

**IGeometryLayerStyleOptions**:
| 属性 | 类型 | 说明 |
|------|------|------|
| `mapTexture` | `string` | 地图纹理 |
| `terrainTexture` | `string` | 地形纹理 |
| `center` | `[number, number]` | 平面中心 |
| `width` | `number` | 平面宽度 |
| `height` | `number` | 平面高度 |
| `widthSegments` | `number` | 宽度段数 |
| `heightSegments` | `number` | 高度段数 |
| `terrainClipHeight` | `number` | 地形裁剪高度 |
| `rgb2height` | `(r, g, b) => number` | RGB 转高度函数 |
| `canvasWidth` | `number` | Canvas 宽度 |
| `canvasHeight` | `number` | Canvas 高度 |
| `drawCanvas` | `(canvas: HTMLCanvasElement) => void` | Canvas 绘制回调 |
| `spriteAnimate` | `string` | 精灵动画类型 |
| `spriteRadius` | `number` | 精灵半径 |
| `spriteCount` | `number` | 精灵数量 |
| `spriteSpeed` | `number` | 精灵速度 |

---

### IBaseLayerStyleOptions (所有图层共有)

| 属性                        | 类型      | 说明               |
| --------------------------- | --------- | ------------------ |
| `opacity`                   | `number`  | 透明度             |
| `depth`                     | `boolean` | 是否开启深度检测   |
| `blend`                     | `string`  | 混合方式           |
| `raisingHeight`             | `number`  | 抬升高度           |
| `heightfixed`               | `boolean` | 高度是否固定       |
| `zIndex`                    | `number`  | z-index            |
| `mask`                      | `boolean` | 是否允许蒙层       |
| `maskInside`                | `boolean` | 是否显示在蒙层内部 |
| `enableRelativeCoordinates` | `boolean` | 是否启用相对坐标系 |
| `color`                     | `string`  | 颜色               |
| `size`                      | `number`  | 大小               |

### ILayerConfig (图层通用配置)

| 属性                      | 类型                                | 说明                     |
| ------------------------- | ----------------------------------- | ------------------------ |
| `name`                    | `string`                            | 图层名称                 |
| `zIndex`                  | `number`                            | 层级                     |
| `visible`                 | `boolean`                           | 是否可见                 |
| `minZoom`                 | `number`                            | 最小可见缩放             |
| `maxZoom`                 | `number`                            | 最大可见缩放             |
| `autoFit`                 | `boolean`                           | 是否自动适配             |
| `enableHighlight`         | `boolean`                           | 是否启用高亮             |
| `highlightColor`          | `string`                            | 高亮颜色                 |
| `activeMix`               | `number`                            | 高亮混合比例             |
| `enableSelect`            | `boolean`                           | 是否启用选中             |
| `selectColor`             | `string`                            | 选中颜色                 |
| `selectMix`               | `number`                            | 选中混合比例             |
| `enableMultiPassRenderer` | `boolean`                           | 是否启用多通道渲染       |
| `passes`                  | `Array<string \| [string, object]>` | 多通道渲染配置           |
| `pickedFeatureID`         | `number`                            | 拾取要素 ID              |
| `maskLayers`              | `ILayer[]`                          | 蒙层图层列表             |
| `maskfence`               | `any`                               | 蒙层数据（兼容旧接口）   |
| `maskColor`               | `string`                            | 蒙层颜色（兼容旧接口）   |
| `maskOpacity`             | `number`                            | 蒙层透明度（兼容旧接口） |
| `animateOption`           | `IAnimateOption`                    | 动画选项                 |
| `layerType`               | `string`                            | 图层类型标识             |

### IAnimateOption (动画选项)

| 属性          | 类型      | 说明         |
| ------------- | --------- | ------------ |
| `enable`      | `boolean` | 是否启用动画 |
| `duration`    | `number`  | 持续时间     |
| `interval`    | `number`  | 间隔时间     |
| `trailLength` | `number`  | 拖尾长度     |
| `speed`       | `number`  | 速度         |

---

## 附录: 完整导出清单

### @antv/l7 主包导出

```typescript
// 场景
export { Scene } from '@antv/l7-scene';

// 地图
export {
  GaodeMap,
  GaodeMapV1,
  GaodeMapV2,
  BaiduMap,
  Earth,
  GoogleMap,
  Map,
  Mapbox,
  MapLibre,
  TencentMap,
  TMap,
  MapType,
  Viewport,
} from '@antv/l7-maps';
export { MapMouseEvent, MercatorCoordinate, SimpleMapCoord } from '@antv/l7-map';

// 图层
export {
  BaseLayer,
  BaseModel,
  CanvasLayer,
  CityBuildingLayer,
  EarthLayer,
  GeometryLayer,
  HeatmapLayer,
  ImageLayer,
  LineLayer,
  MaskLayer,
  PointLayer,
  PolygonLayer,
  RasterLayer,
  TileDebugLayer,
  TileLayer,
  WindLayer,
} from '@antv/l7-layers';

// 组件
export {
  Control,
  ButtonControl,
  SelectControl,
  PopperControl,
  Zoom,
  Scale,
  Logo,
  Fullscreen,
  GeoLocate,
  LayerSwitch,
  MouseLocation,
  MapTheme,
  Swipe,
  ExportImage,
  Marker,
  MarkerLayer,
  Popup,
  LayerPopup,
} from '@antv/l7-component';

// 数据源
export {
  default as Source,
  getParser,
  registerParser,
  getTransform,
  registerTransform,
  rasterDataTypes,
} from '@antv/l7-source';

// Core 导出 (含类型、接口等)
export * from '@antv/l7-core';
export * from '@antv/l7-utils';
```
