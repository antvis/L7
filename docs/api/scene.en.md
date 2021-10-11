---
title: Scene
order: 2
---

`markdown:docs/common/style.md`

# 简介

## Scene

```javascript
// Module 引用
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    style: 'dark',
    center: [110.770672, 34.159869],
    pitch: 45,
  }),
});

// CDN 使用方法
const scene = new L7.Scene({
  id: 'map',
  map: new L7.GaodeMap({
    style: 'dark',
    center: [110.770672, 34.159869],
    pitch: 45,
  }),
});
```

## Map

L7 地理可视化侧重于地理数据的可视化表达，地图层需要依赖第三方地图，第三方地图通过 Scene 统一创建，创建管理
只需要通过 Scene 传入地图配置项即可。

目前 L7 支持两种地图底图

- 高德地图 国内业务场景 合规中国地图
- MapBox 国际业务，或者内网离线部署场景

### map

可以通过 scene map 属性获取 map 实例

```javascript
const map = scene.map;
```

为了统一不同底图之前的接口差异 L7 在 scene 层对 map 的方法做了统一，因此一些地图的操作方法可以通过 scene 调用这样，切换不同底图时保证表现一致。

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

### 构造函数

**Scene**

## 配置项

### 地图配置项

### id

需传入 dom 容器或者容器 id  {domObject || string} [必选]

### logoPosition

L7 Logo 的显示位置 默认左下角

- bottomright
- topright
- bottomleft
- topleft
- topcenter
- bottomcenter
- leftcenter
- rightcenter

### logoVisible

是否显示 L7 的 Logo {boolean} true

### zoom

地图初始显示级别 {number} （0-22）

### center

地图初始中心经纬度 {Lnglat}

### pitch

地图初始俯仰角度 {number}  default 0

### style

简化地图样式设置，L7 内置了三种主题默认样式 高德，mapbox 都可以使用

- dark
- light
- normal
- blank 无底图

除了内置的样式，你也可以传入自定义的其他属性。

比如高德地图

```javascript
{
  style: 'amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true'; // 设置方法和高德地图一致
}
```

### minZoom

地图最小缩放等级 {number}  default 0 (0-22)

### maxZoom

地图最大缩放等级 {number}  default 22 (0-22)

### rotateEnable

地图是否可旋转 {Boolean} default true

## 方法

### getZoom

获取当前缩放等级

```javascript
scene.getZoom();
```

return {float}   当前缩放等级

### getLayers()

获取所有的地图图层

```javascript
scene.getLayers();
```

### getLayerByName(name)

根据图层名称获取图层

参数

-name {string}

layer 初始化可配置图层 name

```javascript
scene.getLayerByName(name);
```

return Layer 图层对象

### getCenter()

获取地图中心点

```javascript
scene.getCenter();
```

return {Lnglat} :地图中心点

### getSize()

获取地图容器大小

```javascript
scene.getSize();
```

return { Object } 地图容器的 width,height

### getPitch()

获取地图俯仰角

```javascript
scene.getPitch();
```

return {number} pitch

### setMapStyle

参数：`style` {string} 地图样式 具体样式格式和各底图设置方法一致

L7 内置了三种地图样式，AMAP 和 MapBox 都适用

- light
- dark
- normal

设置地图底图样式的方法

```javascript
// 快捷名称设置

scene.setMapStyle('light');

// mapbox 主题设置
scene.setMapStyle('mapbox://styles/mapbox/streets-v11');

// AMap
scene.setMapStyle(
  'amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true',
);
```

### setCenter()

设置地图中心点坐标

```javascript
scene.setCenter([lng, lat]);
```

参数：`center` {LngLat} 地图中心点

### setZoomAndCenter

设置地图等级和中心

```javascript
scene.setZoomAndCenter(zoom, center);
```

参数：

- zoom {number}
- center {LngLat}

### setMapStatus

参数 :

```javascript
 IStatusOptions {
  showIndoorMap: boolean;
  resizeEnable: boolean;
  dragEnable: boolean;
  keyboardEnable: boolean;
  doubleClickZoom: boolean;
  zoomEnable: boolean;
  rotateEnable: boolean;
```

```javascript
scene.setMapStatus({ dragEnable: false });
```

### setRotation

设置地图顺时针旋转角度，旋转原点为地图容器中心点，取值范围 [0-360]

```javascript
scene.setRotation(rotation);
```

参数： `rotation` {number}

### zoomIn

地图放大一级

```javascript
scene.zoomIn();
```

### zoomOut

地图缩小一级

```javascript
scene.ZoomOUt();
```

### panTo

地图平移到指定的位置

```javascript
scene.panTo(LngLat);
```

参数：

- `center` LngLat 中心位置坐标

### panBy

以像素为单位沿 X 方向和 Y 方向移动地图

```javascript
scene.panBy(x, y);
```

参数：

- `x` {number} 水平方向移动像素 向右为正方向

- `y` {number} 垂直方向移动像素 向下为正方向

### setPitch

设置地图仰俯角度

```javascript
scene.setPitch(pitch);
```

参数 :

- `pitch` {number}

### fitBounds

地图缩放到某个范围内

参数 :

- `extent` { array} 经纬度范围 [[minlng,minlat],[maxlng,maxlat]]

```javascript
scene.fitBounds([
  [112, 32],
  [114, 35],
]);
```

### getContainer

获取地图容器 return htmlElement

```javascript
scene.getContainer();
```

### removeLayer

移除 layer

```javascript
scene.removeLayer(layer);
```

参数

- `layer` {Layer}

### exportMap

导出地图，目前仅支持导出可视化层，不支持底图导出

- 参数 type `png|jpg` 默认 png

scene.exportMap('png')

## 事件

### on

事件监听

#### 参数

`eventName` {string} 事件名
`handler` {function } 事件回调函数

### off

移除事件监听
`eventName` {string} 事件名
`handler` {function } 事件回调函数

### 场景事件

#### loaded

scene 初始化完成事件，scene 初始化完成添加 Layer

```javascript
scene.on('loaded', () => {});
```

#### resize

地图容器变化事件

```javascript
scene.on('resize', () => {}); // 地图容器大小改变事件
```

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
```
