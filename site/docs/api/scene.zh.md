---
title: 场景 Scene
description: 地图场景初始
keywords: 地图 Scene
order: 0
redirect_from:
  - /zh/docs/api
---

<embed src="@/docs/api/common/style.md"></embed>

## 简介

场景对象 `scene` 是包含地图、地图控件、组件、加载资源的全局对象，通过 `scene` 场景对象，我们可以获取到操作地图需要的所有内容。

<div>
  <div style="width:40%;float:left; margin: 10px;">
    <img  width="80%" alt="案例" src='https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*3wMCR7vIlCwAAAAAAAAAAAAAARQnAQ'>
  </div>
</div>

## options

### id

<description> _string | HTMLElement_ **必选** </description>

需传入 dom 容器或者容器 id。

### map

<description> MapInstance **必选** </description>

可以通过 scene map 属性获取 map 实例。

```javascript
const map = scene.map;
```

为了统一不同底图之前的接口差异 `L7` 在 `Scene` 层对 `map` 的方法做了统一，因此一些地图的操作方法可以通过 `Scene` 调用，这样，切换不同底图时可以保证表现一致。

示例代码

```javascript
const scene = new L7.Scene({
  id: 'map',
  map: new L7.GaodeMap({
    style: 'dark',
    center: [110.770672, 34.159869],
    pitch: 45,
  }),
});
```

### logoPosition

<description> _string_ **可选** _default: 'bottomleft'_ </description>

`L7` 默认提供的 `Logo` 可以配置显示位置，默认在左下角。

- bottomright
- topright
- bottomleft
- topleft
- topcenter
- bottomcenter
- leftcenter
- rightcenter

### logoVisible logo 是否可见

<description> _boolean_ **可选** _default: true_ </description>

配置 `L7` 的 `Logo` 是否显示，默认显示。

### antialias 是否开启抗锯齿

<description> _boolean_ **可选** _default: true_ </description>

是否开启抗锯齿。

### stencil 是否开启裁剪

<description> _boolean_ **可选** _default: true_ </description>

是否开启裁剪（stencil）。图层 `Mask` 掩模能力以及矢量瓦片需要开启该配置。

🌟 从 v2.7.2 版本开始支持。

### preserveDrawingBuffer

<description> _boolean_ **可选** _default: false_ </description>

是否保留缓冲区数据。设置为 `true` 时可通过 `canvas.toDataURL()` 导出地图图片。

### renderer 渲染器

<description> _'regl' | 'device'_ **可选** _default: 'device'_ </description>

指定渲染器类型。`regl` 为旧版渲染器，`device` 为新版渲染器（基于 `@antv/g-device-api`），默认使用 `device` 渲染器。

```javascript
const scene = new Scene({
  id: 'map',
  map: new Map({}),
  renderer: 'device', // 或 'regl'
});
```

### animate 是否启用动画

<description> _boolean_ **可选** _default: undefined_ </description>

是否启用动画渲染。

### debug 是否开启调试

<description> _boolean_ **可选** _default: false_ </description>

是否开启调试模式，开启后会输出调试信息。

### pickBufferScale 选取缓冲区缩放比

<description> _number_ **可选** _default: 1.0_ </description>

设置像素选取（picking）缓冲区的缩放比。

### fitBoundsOptions 适配边界选项

<description> _object_ **可选** </description>

当调用 `fitBounds` 方法时默认的选项配置，包含 `animate` 等参数。

## Layer 方法

### addLayer(layer): void 增加图层对象

把图层添加到 `Scene` 场景中。

参数 :

- `layer` 图层对象

```javascript
scene.addLayer(layer);
```

### getLayer(id: string): ILayer 获取对应的图层对象

获取对应的图层。

```javascript
scene.getLayer('layerID');
```

### getLayers(): ILayer[] 获取所有的地图图层

获取所有的地图图层。

```javascript
scene.getLayers();
```

### getLayerByName(name: string): ILayer 根据图层名称获取图层

根据图层名称获取图层。

- `name` 图层在初始化的时候配置图层的 `name`。

```javascript
scene.getLayerByName(name);
```

### removeLayer(layer: ILayer): void 移除 layer 图层

移除 `layer` 图层。

```javascript
scene.removeLayer(layer);
```

🌟 移除的同时会将图层进行销毁。

### removeAllLayer(): Promise\<void\> 移除所有的图层对象

移除所有的图层对象。

```javascript
await scene.removeAllLayer();
```

🌟 移除的同时会将图层进行销毁。

### render(): void 手动触发渲染

手动触发场景重新渲染。

```javascript
scene.render();
```

### setEnableRender(flag: boolean): void 设置是否启用渲染

控制是否允许图层渲染更新。当设置为 `false` 时，图层的渲染将被暂停。

```javascript
scene.setEnableRender(false); // 暂停渲染
scene.setEnableRender(true); // 恢复渲染
```

### getPickedLayer(): string 获取当前拾取的图层

获取当前被鼠标拾取（hover/click）的图层 ID。

```javascript
const layerId = scene.getPickedLayer();
```

## 控制组件方法

### addControl(ctl: IControl): void 添加组件控件

添加组件控件。

- `crl` 用户创建的控件对象。

```javascript
scene.addControl(ctl);
```

### removeControl(ctr: IControl): void 移除用户添加的组件控件

移除用户添加的组件控件。

- `ctl` 用户创建的控件对象。

```javascript
scene.removeControl(ctl);
```

### getControlByName(name: string): IControl 根据控件的名称来获取控件

根据控件的名称来获取控件。

```javascript
const zoomControl = new Zoom({
  // zoom 控件
  name: 'z1', // 用户传入的控件名称（也可以不传入，该控件默认名称为 zoom）
  position: 'topright',
});

scene.getControlByName('z1');
```

## 气泡方法

### addPopup(popup: Popup): void 添加气泡

往场景中添加气泡对象，气泡用于展示用户自定义信息。

```javascript
scene.addPopup(popup);
```

### removePopup(popup: Popup): void 移除气泡

往场景中移除气泡对象

```javascript
scene.removePopup(popup);
```

## 标记方法

### addMarker(maker: IMarker): void 添加标记

往场景中添加标记对象，`Marker` 实例是用户自由控制的 `DOM`。

- `maker` 用户创建的 `Marker` 实例。

```javascript
const marker = new Marker({
  element: el,
}).setLnglat({ lng: nodes[i].x * 1, lat: nodes[i].y });
scene.addMarker(marker);
```

### addMarkerLayer(layer: IMarkerLayer): void 添加 Marker 统一管理图层

当用户需要添加许多个 `Marker` 实例时，为了方便管理可以使用 `MarkerLayer` 对象统一管理。

- `layer` 标记图层对象。

```javascript
const markerLayer = new MarkerLayer();
scene.addMarkerLayer(markerLayer);
```

### removeMarkerLayer(layer: IMarkerLayer): void 移除标签图层

移除标签图层。

- `layer` 标记图层对象。

```javascript
scene.removeMarkerLayer(markerLayer);
```

### removeAllMarkers(): void 移除场景中所有的标签对象

移除场景中所有的标签对象。

```javascript
scene.removeAllMarkers();
```

### removeAllMakers(): void ⚠️ 已废弃

> ⚠️ 此方法已废弃，请使用 `removeAllMarkers()` 替代。

## 静态方法

静态方法通过 Scene 类去调用，不是 scene 实例

### addProtocol

添加自定义数据协议，设置一个自定义加载瓦片函数，当使用以自定义 URL 模式开头的数据时，该函数将被调用。

- protocol 协议名称
- handler 数据处理回调函数
  - requestParameters: RequestParameters,
    - url 瓦片 URL，携带瓦片行列号 x,y,z
  - callback: ResponseCallback<any>) => Cancelable
    - Cancelable： {
      cancel: () => void;
      };

#### 自定义函数

```ts
Scene.addProtocol('custom', (params, callback) => {
  fetch(`https://${params.url.split('://')[1]}`)
    .then((t) => {
      if (t.status == 200) {
        t.arrayBuffer().then((arr) => {
          callback(null, arr, null, null);
        });
      } else {
        callback(new Error(`Tile fetch error: ${t.statusText}`));
      }
    })
    .catch((e) => {
      callback(new Error(e));
    });
  return { cancel: () => {} };
});
// the following is an example of a way to return an error when trying to load a tile
Scene.addProtocol('custom2', (params, callback) => {
  callback(new Error('someErrorMessage'));
  return { cancel: () => {} };
});
```

#### 加载 PMTiles

```ts
import * as pmtiles from 'pmtiles';
const protocol = new pmtiles.Protocol();
const scene = new Scene({
  id: 'map',
  map: new Map({
    center: [11.2438, 43.7799],
    zoom: 12,
  }),
});

scene.addProtocol('pmtiles', protocol.tile);
const source = new Source(
  'pmtiles://https://mdn.alipayobjects.com/afts/file/A*HYvHSZ-wQmIAAAAAAAAAAAAADrd2AQ/protomaps(vector)ODbL_firenze.bin',
  {
    parser: {
      type: 'mvt',
      tileSize: 256,
      maxZoom: 14,
      extent: [-180, -85.051129, 179, 85.051129],
    },
  },
);
```

### removeProtocol

删除之前添加的协议

- name: 协议名称

```ts
scene.removeProtocol('pmtiles', protocol.tile);
```

## 地图方法

### getZoom(): number 获取缩放等级

获取当前缩放等级。

```javascript
scene.getZoom();
```

### getCenter(): ILngLat 获取地图中心

获取地图中心点

```javascript
interface ILngLat {
  lng: number;
  lat: number;
}

scene.getCenter();
```

### getSize(): [number, number] 获取地图容器大小

获取地图容器大小，width、height。

```javascript
scene.getSize();
```

### getPitch(): number 获取地图倾角

获取地图俯仰角。

```javascript
scene.getPitch();
```

### getContainer(): HTMLElement | null 获取地图容器

获取地图容器。

```javascript
scene.getContainer();
```

### setMapStyle(style: string): void 设置地图样式

参数 `style` 参数是字符串，可以选择内置的地图样式 具体样式格式和各底图设置方法一致。

`L7` 内置了三种地图样式，`AMAP` 和 `MapBox` 都适用。

- light
- dark
- normal

设置地图底图样式的方法。

```javascript
// 快捷名称设置
scene.setMapStyle('light');

// mapbox 主题设置
scene.setMapStyle('mapbox://styles/mapbox/streets-v11');

// AMap
scene.setMapStyle('amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true');
```

### setCenter(center: ICenter, option?: ICameraOptions): void 设置地图中心点

设置地图中心点坐标。`L7` 提供了 `setCenter` 方法，允许用户动态的设置地图的中心点位，同时允许通过可选的 `options` 属性设置偏移。

```js
type ICenter = [number, number];
interface ICameraOptions {
  padding:
    | number
    | [number, number, number, number]
    | {
        top?: number,
        bottom?: number,
        right?: number,
        left?: number,
      };
}

scene.setCenter([lng, lat]);
scene.setCenter([lng, lat], {
  padding: {
    top: 100,
  },
});
```

🌟 `padding` 参数支持如下的三种传值方式，数值的单位是 `px`，表示地图中心点距离容器边缘的偏移距离。

```javascript
export interface ICameraOptions {
  padding:
    | number
    | [number, number, number, number]
    | {
        top?: number,
        bottom?: number,
        right?: number,
        left?: number,
      };
}
```

[在线案例](/examples/point/bubble#point)

### setZoomAndCenter(zoom: number, center: ICenter): void 设置地图缩放等级和中心点

设置地图等级和中心。

```javascript
type ICenter = [number, number];
scene.setZoomAndCenter(zoom, center);
```

### setZoom(zoom: number): void 设置地图缩放等级

设置地图缩放等级

```javascript
scene.setZoom(10);
```

### setRotation(rotation: number): void 设置地图旋转

设置地图顺时针旋转角度，旋转原点为地图容器中心点，取值范围 [0-360]。

```javascript
scene.setRotation(rotation);
```

### zoomIn(); void 地图放大一级

地图放大一级。

```javascript
scene.zoomIn();
```

### zoomOut(): void 地图缩小一级

地图缩小一级。

```javascript
scene.zoomOut();
```

### panTo(lnglat: ILngLat): void 地图移动

地图平移到指定的经纬度位置。

```javascript
type ILngLat = [number, number];
scene.panTo(LngLat);
```

### panBy(x: number, y: number): void 地图平移

以像素为单位沿 X 方向和 Y 方向移动地图。

- `x` 水平方向移动像素 向右为正方向。
- `y` 垂直方向移动像素 向下为正方向。

```javascript
scene.panBy(x, y);
```

### setPitch(pitch: number): void 设置地图倾角

设置地图仰俯角度。

```javascript
scene.setPitch(pitch);
```

### setMapStatus(statusOption: IStatusOptions): void 设置地图状态

用来设置地图的一些交互配置。

```javascript
interface IStatusOptions {
  showIndoorMap: boolean;
  resizeEnable: boolean;
  dragEnable: boolean;
  keyboardEnable: boolean;
  doubleClickZoom: boolean;
  zoomEnable: boolean;
  rotateEnable: boolean;
}

scene.setMapStatus({ dragEnable: false });
```

### fitBounds(bound: IBounds, options?: IOptions): void 设置地图缩放范围

地图缩放到某个范围内。

- `bound` 表示经纬度范围 [[minlng,minlat],[maxlng,maxlat]]。
- `options` 用户传入，覆盖 `animate` 直接配置，覆盖 `Scene` 传入的配置项。

```javascript
type IBounds = [[number, number], [number, number]];
interface IOptions {
  [key]: any;
  animate: boolean;
}

scene.fitBounds([
  [112, 32],
  [114, 35],
]);
```

### containerToLngLat(point: IPoint): ILngLat 画布坐标转经纬度

将画布坐标转经纬度坐标

```javascript
type IPoint = [number, number];
interface ILngLat {
  lng: number;
  lat: number;
}

scene.containerToLngLat([10, 10]);
```

### lngLatToContainer(lnglat: ILngLat): IPoint 经纬度转画布坐标

经纬度坐标转画布坐标。

```javascript
type ILngLat = [number, number];
interface IPoint {
  x: number;
  y: number;
}

scene.lngLatToContainer([120, 10]);
```

### pixelToLngLat(pixel: IPoint): ILngLat 像素坐标转经纬度

地图像素坐标转经纬度坐标，像素坐标地图上某点距离容器左上角的位置。

```javascript
type IPoint = [number, number];
interface ILngLat {
  lng: number;
  lat: number;
}
scene.pixelToLngLat([10, 10]);
```

### lngLatToPixel(lnglat: ILngLat): IPoint 经纬度转像素坐标

经纬度坐标转像素坐标。

```javascript
type ILngLat = [number, number];
interface IPoint {
  x: number;
  y: number;
}
scene.lngLatToPixel([120, 10]);
```

### exportMap(type?: IImage): string 导出

导出地图，目前仅支持导出可视化层，不支持底图导出。

```javascript
type IImage = 'png' | 'jpg';
scene.exportMap('png');
```

### exportPng(type?: 'png' | 'jpg'): string 导出图片

`exportMap` 的别名方法，导出地图为图片。

```javascript
scene.exportPng('png'); // 等同于 scene.exportMap('png')
scene.exportPng('jpg'); // 等同于 scene.exportMap('jpg')
```

### setBgColor(color: string): void 设置背景色

设置场景背景颜色。

```javascript
scene.setBgColor('#000000');
```

### registerPostProcessingPass(constructor: any, name: string): void 注册后处理通道

注册后处理特效通道，用于实现如泛光（Bloom）、色彩校正等后处理效果。

```javascript
import { Scene, PostProcessingPass } from '@antv/l7';

scene.registerPostProcessingPass(PostProcessingPass, 'bloom');
```

### enableShaderPick(): void 启用着色器拾取

启用着色器拾取模式。

```javascript
scene.enableShaderPick();
```

### disableShaderPick(): void 禁用着色器拾取

禁用着色器拾取模式。

```javascript
scene.disableShaderPick();
```

### diasbleShaderPick(): void ⚠️ 已废弃

> ⚠️ 此方法名拼写错误已废弃，请使用 `disableShaderPick()` 替代。

### enableBoxSelect(once?: boolean): void 启用框选

启用框选功能，允许用户通过拖拽矩形框来选择区域。`once` 参数为 `true` 时表示只触发一次框选后自动关闭。

```javascript
scene.enableBoxSelect(); // 持续框选
scene.enableBoxSelect(true); // 框选一次后自动关闭
```

框选事件可通过 `boxselect` 事件监听：

```javascript
scene.on('boxselect', (e) => {
  console.log(e.bounds); // 框选的经纬度范围
});
```

### disableBoxSelect(): void 禁用框选

禁用框选功能。

```javascript
scene.disableBoxSelect();
```

### boxSelectEnable: boolean 框选状态

属性，表示当前框选是否启用。

### startAnimate(): void 启动动画

启动持续渲染动画。默认情况下 L7 按需渲染，调用此方法可开启实时渲染循环，在需要持续动画或使用 SpectorJS 调试时非常有用。

```javascript
scene.startAnimate();
```

### stopAnimate(): void 停止动画

停止实时渲染动画，恢复按需渲染模式。

```javascript
scene.stopAnimate();
```

### getPointSizeRange(): Float32Array 获取点精灵大小范围

获取当前设备支持绘制的 `WebGL` 点精灵的大小范围。

```javascript
const range = scene.getPointSizeRange();
// range[0] 最小值, range[1] 最大值
```

### getMapService(): IMapService 获取地图服务

获取底层地图服务实例，可用于直接调用底图特有方法。

```javascript
const mapService = scene.getMapService();
```

### getMapContainer(): HTMLElement 获取地图容器

获取地图的主容器 DOM 元素。

```javascript
const container = scene.getMapContainer();
```

### getMapCanvasContainer(): HTMLElement 获取地图画布容器

获取地图画布容器的 DOM 元素。

```javascript
const canvasContainer = scene.getMapCanvasContainer();
```

### getServiceContainer(): IContainer 获取服务容器

获取依赖注入容器，可用于获取注册的服务实例。

```javascript
const container = scene.getServiceContainer();
```

### getType(): string 获取地图类型

获取当前使用的地图类型。

```javascript
const mapType = scene.getType(); // 如 'gaode', 'mapbox', 'map' 等
```

### getMinZoom(): number 获取最小缩放等级

获取地图支持的最小缩放等级。

```javascript
const minZoom = scene.getMinZoom();
```

### getMaxZoom(): number 获取最大缩放等级

获取地图支持的最大缩放等级。

```javascript
const maxZoom = scene.getMaxZoom();
```

### addIconFontGlyphs(fontFamily: string, glyphs: string[]): void 添加 IconFont 字形

为指定字体族添加字形数据，用于 SDF 文本渲染。

- `fontFamily` 字体族名称
- `glyphs` 字形数据数组

```javascript
scene.addIconFontGlyphs('iconfont', ['glyph1', 'glyph2']);
```

### destroy(): void 场景销毁

`scene` 销毁方法，离开页面，不需要使用地图的时候调用，调用后 `scene` 中的资源和都会被销毁。

```javascript
scene.destroy();
```

## iconfont 映射支持

### addIconFont(name: string, unicode: string): void 增加映射支持

支持对用户传入的数据进行 `unicode` 的映射，在内部维护一组名称和对应 `key` 的键值对。

```javascript
scene.addIconFont('icon1', '&#xe64b;');
scene.addIconFont('icon2', '&#xe64c;');
scene.addFontFace(fontFamily, fontPath);
const pointIconFontLayer = new PointLayer({})
  .source(
    [
      {
        j: 140,
        w: 34,
        m: 'icon1',
      },
      {
        j: 140,
        w: 36,
        m: 'icon2',
      },
    ],
    {
      parser: {
        type: 'json',
        x: 'j',
        y: 'w',
      },
    },
  )
  .shape('m', 'text')
  .size(12)
  .color('w', ['#f00', '#f00', '#0f0'])
  .style({
    fontFamily,
    iconfont: true,
    textAllowOverlap: true,
  });
```

### addIconFonts(option: IOption): void 同时传入多组 name - unicode 的键值对

同时传入多组 `name - unicode` 的键值对。

```javascript
type IKeyValue = [name: string, unicode: string];
type IOption = Array<IKeyValue>;

scene.addIconFonts([
  ['icon1', '&#xe64b;'],
  ['icon2', '&#xe64c;'],
]);
```

## 全局资源

### addImage(id: string, img: IImage): void 添加全局资源

在 `scene` 全局中添加 `L7` 的图层对象可以使用的图片资源在。

```javascript
type IImage = HTMLImageElement | string | File；

scene.addImage( '02','https://gw.alipayobjects.com/zos/bmw-prod/ce83fc30-701f-415b-9750-4b146f4b3dd6.svg');
```

[示例地址](/examples/gallery/animate#animate_path_texture)

### hasImage(id: string): boolean 判断全局图片资源

判断是否已经在全局添加过相应的图片资源。

```javascript
scene.hasImage('imageID');
```

### removeImage(id: string): void 全局删除图片资源

从全局删除对应的图片资源。

```javascript
scene.removeImage('imageID');
```

### addFontFace(fontFamily: string, fontPath: string): void 添加字体文件

添加 `iconfont` 字体文件。

- `fontFamily` 用户为自己定义的字体名称
- `fontPath` 导入的文件地址

```javascript
let fontFamily = 'iconfont';
let fontPath = '//at.alicdn.com/t/font_2534097_iiet9d3nekn.woff2?t=1620444089776';
scene.addFontFace(fontFamily, fontPath);
```

## 属性

### loaded: boolean

场景是否加载完成。

```javascript
if (scene.loaded) {
  console.log('场景已加载');
}
```

### map: IMapInstance

获取底层地图实例，可用于调用底图特有的 API。

```javascript
const mapInstance = scene.map;
```

## 事件

### on(eventName: string, handler: function): void

在 `scene` 上绑定事件监听。

- `eventName` 事件名。
- `handler` 事件回调函数。

### off(eventName: string, handler: function): void

移除在 `scene` 上绑定的事件监听。

- `eventName` 事件名。
- `handler` 事件回调函数。

### once(eventName: string, handler: function): void

在 `scene` 上绑定一次性事件监听，触发一次后自动移除。

- `eventName` 事件名。
- `handler` 事件回调函数。

### 场景事件

`scene` 会触发一些常见的场景事件，用户在需要的时候可以进行监听。

#### loaded

`scene` 初始化完成事件，我们经常在 `scene` 初始化完成后添加 `Layer`。

```javascript
scene.on('loaded', () => {
  scene.addLayer(layer);
});
```

#### maploaded

底层地图加载完成事件。

```javascript
scene.on('maploaded', () => {
  console.log('底图加载完成');
});
```

#### fontloaded

字体加载完成事件。

```javascript
scene.on('fontloaded', () => {
  console.log('字体加载完成');
});
```

#### resize

地图容器变化事件

```javascript
scene.on('resize', () => {}); // 地图容器大小改变事件
```

#### destroy

场景销毁事件。

```javascript
scene.on('destroy', () => {
  console.log('场景已销毁');
});
```

#### startAnimate

默认 L7 按需重绘，通过启动动画开启实时渲染，便于 SpectorJS 插件捕捉帧渲染。

#### stopAnimate

调试时使用，停止实时渲染

### 地图事件

```javascript
scene.on('loaded', () => {}); //地图加载完成触发
scene.on('mapmove', () => {}); // 地图平移时触发事件
scene.on('movestart', () => {}); // 地图平移开始时触发
scene.on('moveend', () => {}); // 地图移动结束后触发，包括平移，以及中心点变化的缩放。如地图有拖拽缓动效果，则在缓动结束后触发
scene.on('zoomchange', () => {}); // 地图缩放级别更改后触发
scene.on('zoomstart', () => {}); // 缩放开始时触发
scene.on('zoomend', () => {}); // 缩放停止时触发
```

其他地图事件可以查看相应底图的事件文档,地图事件也可以通过 `Scene.map` 进行设置。

[Mapbox](https://docs.mapbox.com/mapbox-gl-js/api/#map.event)
[高德](https://lbs.amap.com/api/javascript-api/reference/map)

### 鼠标事件

```javascript
scene.on('click', (ev) => {}); // 鼠标左键点击事件
scene.on('dblclick', (ev) => {}); // 鼠标左键双击事件
scene.on('mousemove', (ev) => {}); // 鼠标在地图上移动时触发
scene.on('mousewheel', (ev) => {}); // 鼠标滚轮开始缩放地图时触发
scene.on('mouseover', (ev) => {}); // 鼠标移入地图容器内时触发
scene.on('mouseout', (ev) => {}); // 鼠标移出地图容器时触发
scene.on('mouseup', (ev) => {}); // 鼠标在地图上单击抬起时触发
scene.on('mousedown', (ev) => {}); // 鼠标在地图上单击按下时触发
scene.on('contextmenu', (ev) => {}); // 鼠标右键单击事件
scene.on('dragstart', (ev) => {}); //开始拖拽地图时触发
scene.on('dragging', (ev) => {}); // 拖拽地图过程中触发
scene.on('dragend', (ev) => {}); //停止拖拽地图时触发。如地图有拖拽缓动效果，则在拽停止，缓动开始前触发

scene.on('webglcontextlost', () => {}); // webgl 上下文丢失
```

### 拖拽事件

```javascript
scene.on('dragstart', (ev) => {}); // 开始拖拽地图时触发
scene.on('dragging', (ev) => {}); // 拖拽地图过程中触发
scene.on('dragend', (ev) => {}); // 停止拖拽地图时触发。如地图有拖拽缓动效果，则在拖拽停止，缓动开始前触发
scene.on('dragcancel', (ev) => {}); // 拖拽取消时触发
```

### 框选事件

当调用 `scene.enableBoxSelect()` 后，框选操作会触发以下事件：

```javascript
scene.on('boxselect', (ev) => {
  console.log(ev.bounds); // 框选的经纬度范围 [[minLng, minLat], [maxLng, maxLat]]
});
scene.on('boxselectstart', (ev) => {}); // 框选开始
scene.on('boxselecting', (ev) => {}); // 框选中
scene.on('boxselectend', (ev) => {}); // 框选结束
```

## 实验参数

实验参数可能会废弃。

### offsetCoordinate: boolean

高德地图适用，是否关闭偏移坐标系， 默认为 `true`。

```js
const scene = new Scene({
  offsetCoordinate: true,
});
```
