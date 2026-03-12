---
skill_id: scene-methods
skill_name: 场景方法
category: core
difficulty: intermediate
tags: [scene, methods, api, map-control]
dependencies: [scene-initialization]
version: 2.x
---

# 场景方法

## 技能描述

掌握 L7 Scene 提供的各种方法，包括图层管理、控件管理、地图操作、坐标转换、资源管理等核心功能。

## 何时使用

- ✅ 动态添加/移除图层
- ✅ 添加地图控件（缩放、比例尺等）
- ✅ 控制地图视角（中心点、缩放、旋转）
- ✅ 坐标系统转换
- ✅ 管理全局图片资源
- ✅ 添加 Popup 和 Marker
- ✅ 导出地图图片

## 前置条件

- 已完成[场景初始化](./scene.md)

## 图层管理方法

### addLayer(layer): void

将图层添加到场景中。

```javascript
import { Scene, PointLayer } from '@antv/l7';

const scene = new Scene({...});

scene.on('loaded', () => {
  const pointLayer = new PointLayer()
    .source(data, { parser: { type: 'json', x: 'lng', y: 'lat' } })
    .shape('circle')
    .size(10)
    .color('#5B8FF9');

  scene.addLayer(pointLayer);
});
```

### getLayers(): ILayer[]

获取所有图层。

```javascript
const layers = scene.getLayers();
console.log('图层数量:', layers.length);

layers.forEach((layer) => {
  console.log('图层ID:', layer.id);
});
```

### getLayer(id: string): ILayer

根据图层 ID 获取图层。

```javascript
const layer = scene.getLayer('layer-id');
if (layer) {
  layer.show();
}
```

### getLayerByName(name: string): ILayer

根据图层名称获取图层。

```javascript
const layer = new PointLayer({ name: 'myPointLayer' })
  .source(data)
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(layer);

// 通过名称获取
const foundLayer = scene.getLayerByName('myPointLayer');
```

### removeLayer(layer: ILayer): void

移除并销毁图层。

```javascript
const layer = scene.getLayer('layer-id');
scene.removeLayer(layer);
// 图层已被销毁，不能再使用
```

⚠️ **注意**：移除图层的同时会自动销毁图层，释放资源。

### removeAllLayer(): void

移除并销毁所有图层。

```javascript
scene.removeAllLayer();
// 所有图层已被移除和销毁
```

## 控件管理方法

### addControl(control: IControl): void

添加控件到场景。

```javascript
import { Scene, Zoom, Scale } from '@antv/l7';

const scene = new Scene({...});

// 添加缩放控件
const zoomControl = new Zoom({
  position: 'topright'
});
scene.addControl(zoomControl);

// 添加比例尺控件
const scaleControl = new Scale({
  position: 'bottomleft'
});
scene.addControl(scaleControl);
```

### removeControl(control: IControl): void

移除控件。

```javascript
const zoomControl = new Zoom({ position: 'topright' });
scene.addControl(zoomControl);

// 移除控件
scene.removeControl(zoomControl);
```

### getControlByName(name: string): IControl

根据控件名称获取控件。

```javascript
const zoomControl = new Zoom({
  name: 'myZoom',
  position: 'topright',
});
scene.addControl(zoomControl);

// 通过名称获取
const control = scene.getControlByName('myZoom');
```

## Popup 管理方法

### addPopup(popup: Popup): void

添加 Popup 弹窗。

```javascript
import { Popup } from '@antv/l7';

const popup = new Popup({
  offsets: [0, 20],
  closeButton: true,
})
  .setLnglat([120.19, 30.26])
  .setHTML('<div>这是一个 Popup</div>');

scene.addPopup(popup);
```

### removePopup(popup: Popup): void

移除 Popup 弹窗。

```javascript
scene.removePopup(popup);
```

## Marker 管理方法

### addMarker(marker: IMarker): void

添加 Marker 标记。

```javascript
import { Marker } from '@antv/l7';

const el = document.createElement('div');
el.className = 'marker-custom';
el.innerHTML = '📍';

const marker = new Marker({ element: el }).setLnglat([120.19, 30.26]);

scene.addMarker(marker);
```

### addMarkerLayer(layer: IMarkerLayer): void

添加 MarkerLayer 统一管理多个 Marker。

```javascript
import { MarkerLayer } from '@antv/l7';

const markerLayer = new MarkerLayer();

data.forEach((item) => {
  const el = document.createElement('div');
  el.textContent = item.name;

  const marker = new Marker({ element: el }).setLnglat([item.lng, item.lat]);

  markerLayer.addMarker(marker);
});

scene.addMarkerLayer(markerLayer);
```

### removeMarkerLayer(layer: IMarkerLayer): void

移除 MarkerLayer。

```javascript
scene.removeMarkerLayer(markerLayer);
```

### removeAllMarkers(): void

移除所有 Marker。

```javascript
scene.removeAllMarkers();
```

## 地图视角控制方法

### getZoom(): number

获取当前缩放级别。

```javascript
const zoom = scene.getZoom();
console.log('当前缩放级别:', zoom);
```

### setZoom(zoom: number): void

设置缩放级别（0-22）。

```javascript
scene.setZoom(12);
```

### zoomIn(): void

地图放大一级。

```javascript
scene.zoomIn();
```

### zoomOut(): void

地图缩小一级。

```javascript
scene.zoomOut();
```

### getCenter(): ILngLat

获取地图中心点。

```javascript
const center = scene.getCenter();
console.log('中心点:', center); // { lng: 120.19, lat: 30.26 }
```

### setCenter(center: [number, number], options?: ICameraOptions): void

设置地图中心点。

```javascript
// 基础用法
scene.setCenter([120.19, 30.26]);

// 带偏移的中心点
scene.setCenter([120.19, 30.26], {
  padding: {
    top: 100,
    bottom: 50,
    left: 100,
    right: 100,
  },
});

// 数组形式的 padding
scene.setCenter([120.19, 30.26], {
  padding: [100, 50, 100, 100], // top, right, bottom, left
});

// 单个数值（四边相同）
scene.setCenter([120.19, 30.26], {
  padding: 50,
});
```

### setZoomAndCenter(zoom: number, center: [number, number]): void

同时设置缩放级别和中心点。

```javascript
scene.setZoomAndCenter(12, [120.19, 30.26]);
```

### getPitch(): number

获取地图倾斜角度（0-60）。

```javascript
const pitch = scene.getPitch();
console.log('倾斜角度:', pitch);
```

### setPitch(pitch: number): void

设置地图倾斜角度（用于 3D 效果）。

```javascript
scene.setPitch(45); // 设置为 45 度倾斜
```

### setRotation(rotation: number): void

设置地图顺时针旋转角度（0-360）。

```javascript
scene.setRotation(90); // 旋转 90 度
```

### panTo(lnglat: [number, number]): void

地图平移到指定经纬度。

```javascript
scene.panTo([120.19, 30.26]);
```

### panBy(x: number, y: number): void

以像素为单位平移地图。

```javascript
// 向右平移 100px，向下平移 50px
scene.panBy(100, 50);

// 向左平移 100px，向上平移 50px
scene.panBy(-100, -50);
```

### fitBounds(bounds: [[number, number], [number, number]], options?: IOptions): void

地图缩放到指定范围。

```javascript
// 基础用法
scene.fitBounds([
  [112, 32], // 西南角 [minLng, minLat]
  [114, 35], // 东北角 [maxLng, maxLat]
]);

// 带动画
scene.fitBounds(
  [
    [112, 32],
    [114, 35],
  ],
  { animate: true },
);
```

## 地图样式和状态方法

### setMapStyle(style: string): void

设置地图样式。

```javascript
// L7 内置样式
scene.setMapStyle('dark'); // 暗色
scene.setMapStyle('light'); // 亮色
scene.setMapStyle('normal'); // 正常

// Mapbox 样式
scene.setMapStyle('mapbox://styles/mapbox/streets-v11');

// 高德样式
scene.setMapStyle('amap://styles/2a09079c3daac9420ee53b67307a8006?isPublic=true');
```

### setMapStatus(options: IStatusOptions): void

设置地图交互状态。

```javascript
scene.setMapStatus({
  dragEnable: true, // 是否允许拖拽
  keyboardEnable: true, // 是否允许键盘操作
  doubleClickZoom: true, // 是否允许双击缩放
  zoomEnable: true, // 是否允许缩放
  rotateEnable: true, // 是否允许旋转
  showIndoorMap: false, // 是否显示室内地图
  resizeEnable: true, // 是否自动调整大小
});

// 禁用所有交互
scene.setMapStatus({
  dragEnable: false,
  zoomEnable: false,
  rotateEnable: false,
});
```

## 容器和尺寸方法

### getContainer(): HTMLElement | null

获取地图容器 DOM 元素。

```javascript
const container = scene.getContainer();
console.log('容器宽度:', container.offsetWidth);
console.log('容器高度:', container.offsetHeight);
```

### getSize(): [number, number]

获取地图容器宽高。

```javascript
const [width, height] = scene.getSize();
console.log(`容器尺寸: ${width} x ${height}`);
```

## 坐标转换方法

### lngLatToContainer(lnglat: [number, number]): IPoint

经纬度转换为容器像素坐标。

```javascript
const point = scene.lngLatToContainer([120.19, 30.26]);
console.log('容器坐标:', point); // { x: 256, y: 128 }
```

### containerToLngLat(point: [number, number]): ILngLat

容器像素坐标转换为经纬度。

```javascript
const lnglat = scene.containerToLngLat([256, 128]);
console.log('经纬度:', lnglat); // { lng: 120.19, lat: 30.26 }
```

### lngLatToPixel(lnglat: [number, number]): IPoint

经纬度转换为屏幕像素坐标。

```javascript
const pixel = scene.lngLatToPixel([120.19, 30.26]);
console.log('像素坐标:', pixel); // { x: 512, y: 384 }
```

### pixelToLngLat(pixel: [number, number]): ILngLat

屏幕像素坐标转换为经纬度。

```javascript
const lnglat = scene.pixelToLngLat([512, 384]);
console.log('经纬度:', lnglat); // { lng: 120.19, lat: 30.26 }
```

**坐标系统说明**：

- **容器坐标**：相对于地图容器左上角的坐标，原点 (0, 0) 在容器左上角
- **像素坐标**：地图的绝对像素坐标，考虑了地图的缩放和平移

## 全局资源管理方法

### addImage(id: string, img: HTMLImageElement | string | File): void

添加全局图片资源，供图层使用。

```javascript
// 添加网络图片
scene.addImage('marker-icon', 'https://example.com/marker.png');

// 添加本地图片元素
const img = document.getElementById('my-image');
scene.addImage('custom-icon', img);

// 在图层中使用
const layer = new PointLayer().source(data).shape('marker-icon').size(20);
```

### hasImage(id: string): boolean

判断是否已添加某个图片资源。

```javascript
if (!scene.hasImage('marker-icon')) {
  scene.addImage('marker-icon', 'https://example.com/marker.png');
}
```

### removeImage(id: string): void

删除全局图片资源。

```javascript
scene.removeImage('marker-icon');
```

### addFontFace(fontFamily: string, fontPath: string): void

添加字体文件（用于 iconfont）。

```javascript
const fontFamily = 'iconfont';
const fontPath = '//at.alicdn.com/t/font_2534097_iiet9d3nekn.woff2?t=1620444089776';

scene.addFontFace(fontFamily, fontPath);

// 在图层中使用
const layer = new PointLayer().source(data).shape('icon', 'text').style({
  fontFamily: 'iconfont',
  iconfont: true,
});
```

### addIconFont(name: string, unicode: string): void

添加 iconfont 映射。

```javascript
scene.addIconFont('home', '&#xe64b;');
scene.addIconFont('location', '&#xe64c;');

// 在数据中使用名称
const data = [
  { lng: 120, lat: 30, icon: 'home' },
  { lng: 121, lat: 31, icon: 'location' },
];

const layer = new PointLayer().source(data).shape('icon', 'text').style({
  fontFamily: 'iconfont',
  iconfont: true,
});
```

### addIconFonts(options: Array<[string, string]>): void

批量添加 iconfont 映射。

```javascript
scene.addIconFonts([
  ['home', '&#xe64b;'],
  ['location', '&#xe64c;'],
  ['star', '&#xe64d;'],
]);
```

## 静态方法

### Scene.addProtocol(protocol: string, handler: Function)

添加自定义数据协议（用于加载特殊格式瓦片）。

```javascript
// 自定义协议
Scene.addProtocol('custom', (params, callback) => {
  fetch(`https://${params.url.split('://')[1]}`)
    .then((response) => {
      if (response.status === 200) {
        response.arrayBuffer().then((buffer) => {
          callback(null, buffer, null, null);
        });
      } else {
        callback(new Error(`加载失败: ${response.statusText}`));
      }
    })
    .catch((error) => {
      callback(new Error(error));
    });

  return { cancel: () => {} };
});

// 使用自定义协议
const source = new Source('custom://your-tile-url/{z}/{x}/{y}', {
  parser: {
    type: 'mvt',
    tileSize: 256,
  },
});
```

**PMTiles 示例**：

```javascript
import * as pmtiles from 'pmtiles';

const protocol = new pmtiles.Protocol();
Scene.addProtocol('pmtiles', protocol.tile);

const source = new Source('pmtiles://https://example.com/tiles.pmtiles', {
  parser: {
    type: 'mvt',
    tileSize: 256,
    maxZoom: 14,
  },
});
```

### Scene.removeProtocol(protocol: string)

删除自定义协议。

```javascript
Scene.removeProtocol('custom');
```

## 导出和调试方法

### exportMap(type?: 'png' | 'jpg'): string

导出地图为图片（仅导出可视化层，不包含底图）。

```javascript
// 导出为 PNG
const pngDataURL = scene.exportMap('png');

// 导出为 JPG
const jpgDataURL = scene.exportMap('jpg');

// 下载图片
const link = document.createElement('a');
link.download = 'map.png';
link.href = pngDataURL;
link.click();
```

### getPointSizeRange(): Float32Array

获取当前设备支持的 WebGL 点精灵大小范围。

```javascript
const [minSize, maxSize] = scene.getPointSizeRange();
console.log(`点大小范围: ${minSize} - ${maxSize}`);
```

### startAnimate(): void

开启实时渲染（用于调试）。

```javascript
scene.startAnimate();
// 便于使用 SpectorJS 等工具捕捉帧渲染
```

### stopAnimate(): void

停止实时渲染。

```javascript
scene.stopAnimate();
```

## 实际应用场景

### 1. 动态切换图层

```javascript
const layers = {
  point: new PointLayer()...,
  line: new LineLayer()...,
  polygon: new PolygonLayer()...
};

function showLayer(type) {
  // 移除所有图层
  scene.removeAllLayer();

  // 添加指定图层
  scene.addLayer(layers[type]);
}

// 切换图层
showLayer('point');
```

### 2. 地图导航

```javascript
function flyTo(city) {
  const cities = {
    beijing: [116.404, 39.915],
    shanghai: [121.473, 31.23],
    guangzhou: [113.264, 23.129],
  };

  scene.setCenter(cities[city]);
  scene.setZoom(12);
}

// 飞到北京
flyTo('beijing');
```

### 3. 数据范围适配

```javascript
function fitData(data) {
  const lngs = data.map((d) => d.lng);
  const lats = data.map((d) => d.lat);

  const bounds = [
    [Math.min(...lngs), Math.min(...lats)],
    [Math.max(...lngs), Math.max(...lats)],
  ];

  scene.fitBounds(bounds);
}
```

### 4. 响应式控件

```javascript
function updateControls() {
  const [width] = scene.getSize();

  // 移动端隐藏部分控件
  if (width < 768) {
    scene.removeControl(zoomControl);
  } else {
    scene.addControl(zoomControl);
  }
}

scene.on('resize', updateControls);
```

## 常见问题

### Q: 图层添加后看不到？

A: 检查：

1. 是否在 `loaded` 事件后添加
2. 图层数据是否正确
3. 图层样式是否配置
4. 地图中心和缩放级别是否合适

### Q: 坐标转换结果不准确？

A: 确保在地图加载完成后进行坐标转换，并且使用正确的坐标系统。

### Q: 如何禁用地图交互？

A: 使用 `setMapStatus` 方法：

```javascript
scene.setMapStatus({
  dragEnable: false,
  zoomEnable: false,
  rotateEnable: false,
});
```

### Q: 如何监听地图属性变化？

A: 使用生命周期事件：

```javascript
scene.on('zoomchange', () => {
  console.log('缩放级别:', scene.getZoom());
});

scene.on('moveend', () => {
  console.log('中心点:', scene.getCenter());
});
```

## 注意事项

⚠️ **内存管理**：使用 `removeLayer` 会自动销毁图层，无需手动调用 `layer.destroy()`

⚠️ **坐标系统**：区分容器坐标和像素坐标的使用场景

⚠️ **资源管理**：及时移除不需要的全局资源（图片、字体）

⚠️ **导出限制**：`exportMap` 只能导出 L7 图层，不包含底图

## 相关技能

- [场景初始化](./scene.md)
- [场景生命周期](./scene-lifecycle.md)
- [图层管理](../layers/point.md)
- [交互组件](../interaction/components.md)
- [事件处理](../interaction/events.md)

## 在线示例

查看更多示例：[L7 官方示例](https://l7.antv.antgroup.com/examples)
