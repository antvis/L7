---
name: antv-l7
title: AntV L7 地理空间可视化
description: |
  基于 WebGL 的大规模地理空间数据可视化引擎。适用于：
  (1) 创建交互式 WebGL 地图应用
  (2) 可视化地理空间数据（点、线、面、热力图）
  (3) 构建位置数据驾驶舱
  (4) 添加地图图层、交互和动画效果
  (5) 处理并展示 GeoJSON、CSV 等空间数据
license: MIT
---

# AntV L7 地理空间可视化

AntV L7 是基于 WebGL 的大规模地理空间数据可视化引擎，支持多种地图底图和丰富的可视化图层类型。

## ⚠️ 重要约束

**作用域声明：以下约束仅适用于 WeaveFox（本仓库）环境。**

**在 WeaveFox 环境下，高德地图配置禁止传入 token 参数。**

在 WeaveFox 项目中，L7 已配置默认 token。在该环境下，`GaodeMap` 配置中**不要**设置 `token` 字段，否则会导致地图加载失败。

```javascript
// ✅ 正确 - 不传 token
new GaodeMap({
  center: [120.19, 30.26],
  zoom: 10,
  style: 'light',
});

// ❌ 错误 - 禁止传入 token
new GaodeMap({
  center: [120.19, 30.26],
  zoom: 10,
  style: 'light',
  token: 'xxx', // 不要这样做！
});
```

## 选型指南

### 简单点位展示（< 100 个点）

**优先使用 Marker**，而非 PointLayer：

```javascript
import { Marker, Popup } from '@antv/l7';

let currentPopup = null;

// ✅ 推荐 - 少量点位使用 Marker
data.forEach((point) => {
  const marker = new Marker({
    color: '#5B8FF9',
    draggable: false,
  }).setLnglat([point.lng, point.lat]);

  marker.on('click', () => {
    // 统一单实例 popup：先移除旧 popup，再创建新 popup
    if (currentPopup) scene.removePopup(currentPopup);

    currentPopup = new Popup({
      anchor: 'bottom',
      className: 'outing-popup',
      lngLat: { lng: point.lng, lat: point.lat },
      html: `<div>${point.name}</div>`,
    });
    scene.addPopup(currentPopup);
  });

  // 必须使用 scene.addMarker，否则地图缩放/平移时 Marker 不会更新位置
  scene.addMarker(marker);
});
```

**Marker vs PointLayer 对比：**

| 特性     | Marker              | PointLayer              |
| -------- | ------------------- | ----------------------- |
| 适用场景 | < 100 个点位        | > 100 个点位/大规模数据 |
| 性能     | DOM 渲染，轻量      | WebGL 渲染，高性能      |
| 交互     | 原生 DOM 事件，灵活 | 需绑定图层事件          |
| 自定义   | 支持任意 HTML/CSS   | 受限于 L7 样式配置      |
| Popup    | 内置支持            | 需额外配置              |

### 大规模数据可视化（> 100 个点）

使用 PointLayer 进行 WebGL 渲染：

```javascript
import { PointLayer } from '@antv/l7';

// ✅ 推荐 - 大量点位使用 PointLayer
const pointLayer = new PointLayer()
  .source(data, {
    parser: { type: 'json', x: 'lng', y: 'lat' },
  })
  .shape('circle')
  .size(10)
  .color('#5B8FF9');

scene.addLayer(pointLayer);
```

## React 最佳实践

### 核心原则

1. **单次初始化**：地图场景只初始化一次
2. **图层分离**：数据更新时只更新图层，不重建地图
3. **完整清理**：组件卸载时清理所有资源
4. **错误处理**：捕获初始化异常

### 硬性规则（防止重复初始化）

以下规则为强约束，生成 React + L7 代码时必须遵守：

1. **初始化 effect 必须空依赖**：创建 `new Scene()` 的 `useEffect` 依赖必须是 `[]`。
2. **禁止在初始化 effect 依赖中放业务状态**：例如 `selectedId`、筛选条件、分页参数。
3. **禁止在初始化 effect 依赖中放易变回调**：例如来自父组件的 `onSelect`、`onClick`、`onChange`。
4. **状态更新走独立 effect**：选中态、数据源、样式变化只能更新图层/Marker，不得 `destroy + new Scene`。
5. **最新值使用 ref**：`loaded` 回调里若需要最新 props，使用 `latestXxxRef.current`，不要依赖闭包旧值。
6. **清理只在卸载时执行**：`scene.destroy()` 只能放在初始化 effect 的 cleanup 中，不能由状态变化触发。
7. **严格区分初始化与更新职责**：初始化负责 `Scene/Layer` 首建，更新负责 `setData`、更新 Marker 或样式。
8. **Popup 锚点默认规则**：点位/Marker 场景默认使用 `anchor: 'bottom'`，让弹窗显示在点位上方。
9. **Popup 方案必须单一**：统一使用 `scene.addPopup(...)`，禁止与 `marker.setPopup(...)`、`popup.addTo(scene)` 混用。
10. **Popup 必须单实例**：创建新 popup 前先 `scene.removePopup(oldPopup)`，避免页面出现多个弹窗。
11. **Marker 形态优先尖角样式**：优先使用“气泡主体 + 尖角(pointer)”图标，尖角必须指向真实经纬度点。
12. **Marker 锚点必须与尖角一致**：尖角在元素底部时，`anchor` 必须使用 `'bottom'`，禁止使用 `'center'` 导致点位偏移。
13. **Marker 文案对齐规则**：文字描述必须在 Marker 主体内水平居中，主体中心与实际点位保持视觉对称。
14. **多行文案稳定规则**：文案允许换行时，主体必须设置 `max-width` 与 `word-break`，且尖角保持 `margin: 0 auto` 居中，防止尖角偏离点位。
15. **应用 UI 层级规则**：地图应用的信息面板、Sidebar、模态框等非地图组件必须设置 `z-index >= 1000`，确保显示在地图 logo 和其他地图固定元素之上。
16. **Popup 关闭按钮规则**：创建 Popup 时必须启用 `closeButton: true`，允许用户点击关闭按钮关闭弹窗，提升交互体验。
17. **Popup 相对位置规则**：Popup 必须显示在 Marker/点位上方，需使用 `offset: [0, -40]` 向上移动，避免与 Marker 气泡重叠遮挡。

反例（禁止）：

```typescript
// 会导致 selectedId 变化时反复销毁并重建 Scene
useEffect(() => {
  const scene = new Scene(...);
  return () => scene.destroy();
}, [selectedId, onSelectLocation]);
```

正例（推荐）：

```typescript
// 只初始化一次
useEffect(() => {
  const scene = new Scene(...);
  return () => scene.destroy();
}, []);

// 状态变化只更新图层，不重建 Scene
useEffect(() => {
  pointLayerRef.current?.setData(nextData);
}, [nextData]);
```

说明：React 18 开发环境 `StrictMode` 会对 mount 做额外检查，可能看到两次初始化日志。只要初始化 effect 为空依赖且职责正确，生产环境不会因此重复重建。

### Marker 样式约束（尖角指向点位）

当使用自定义 Marker DOM 时，默认采用“主体 + 尖角”结构：

```typescript
function createMarkerElement(point: { name: string; color: string }) {
  const el = document.createElement('div');
  el.style.cssText = 'position: relative; transform: translateY(-8px);';
  el.innerHTML = `
    <div style="
      min-width: 88px;
      padding: 6px 10px;
      border-radius: 999px;
      background: ${point.color};
      color: #fff;
      font-size: 12px;
      font-weight: 600;
      text-align: center;
      line-height: 1.2;
      box-shadow: 0 4px 12px rgba(0,0,0,0.2);
      position: relative;
      max-width: 160px;
      white-space: normal;
      word-break: break-word;
    ">${point.name}</div>
    <div style="
      width: 0;
      height: 0;
      border-left: 6px solid transparent;
      border-right: 6px solid transparent;
      border-top: 8px solid ${point.color};
      margin: 0 auto;
    "></div>
  `;
  return el;
}

const marker = new Marker({
  element: createMarkerElement(point),
  anchor: 'bottom',
}).setLnglat([point.lng, point.lat]);
```

约束说明：

- 尖角是点位指示器，必须位于元素底部中心。
- 文案容器使用 `text-align: center`，并保持左右内边距对称。
- 多行文案时必须限制最大宽度并允许换行，避免单行过长导致主体偏斜。
- 为避免遮挡点位，元素整体可上移少量像素（例如 `translateY(-8px)`）。

### 使用 Marker（< 100 个点）

```typescript
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Scene, Marker, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

interface Location {
  id: string;
  lng: number;
  lat: number;
  name: string;
}

export function MarkerMap({ locations }: { locations: Location[] }) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const markersRef = useRef<Marker[]>([]);
  const popupRef = useRef<Popup | null>(null);
  const isInitializedRef = useRef(false);

  // 创建/更新 Markers
  const updateMarkers = useCallback((scene: Scene, data: Location[]) => {
    // 1. 清理旧 marker（避免重复渲染和内存泄漏）
    markersRef.current.forEach(marker => {
      marker.remove();
    });
    markersRef.current = [];

    // 2. 创建新 marker
    data.forEach(point => {
      const marker = new Marker({ color: '#5B8FF9' })
        .setLnglat([point.lng, point.lat]);

      marker.on('click', () => {
        if (popupRef.current) {
          scene.removePopup(popupRef.current);
        }
        popupRef.current = new Popup({
          anchor: 'bottom',
          closeButton: true,
          offset: [0, -40],
          lngLat: { lng: point.lng, lat: point.lat },
          html: `<div>${point.name}</div>`,
        });
        scene.addPopup(popupRef.current);
      });

      // 必须使用 scene.addMarker，否则地图缩放/平移时 Marker 不会联动
      scene.addMarker(marker);
      markersRef.current.push(marker);
    });
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current || isInitializedRef.current) return;

    const scene = new Scene({
      id: mapContainerRef.current,
      map: new GaodeMap({
        center: [105, 35],
        zoom: 4,
        style: 'light',
      }),
    });

    sceneRef.current = scene;
    isInitializedRef.current = true;

    scene.on('loaded', () => {
      updateMarkers(scene, locations);
    });

    return () => {
      if (sceneRef.current) {
        if (popupRef.current) {
          sceneRef.current.removePopup(popupRef.current);
          popupRef.current = null;
        }
        markersRef.current.forEach(marker => marker.remove());
        markersRef.current = [];
        sceneRef.current.destroy();
        sceneRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // 数据更新时重建 markers
  useEffect(() => {
    if (isInitializedRef.current && sceneRef.current) {
      updateMarkers(sceneRef.current, locations);
    }
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: 'min(70vh, 600px)', minHeight: '360px' }}
    />
  );
}
```

**Marker 关键注意点：**

- `markersRef` 保存实例数组，用于数据更新时清理旧 marker
- `scene.addMarker(marker)` 必须用它，`.addTo(scene)` 不会注册相机事件，导致 marker 与地图不同步
- Popup 统一使用 `scene.addPopup(...)`，不要和 `marker.setPopup(...)` 混用
- 点位弹窗默认 `anchor: 'bottom'`，确保弹窗显示在 marker 上方
- 组件卸载时遍历 `markersRef.current` 逐一 `remove()`

### 使用 PointLayer（> 100 个点）

```typescript
'use client';

import { useEffect, useRef, useCallback } from 'react';
import { Scene, PointLayer, Popup } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';

interface Location {
  id: string;
  lng: number;
  lat: number;
  name: string;
  color: string;
}

interface MapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

export function TravelMap({ locations, onLocationClick }: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const pointLayerRef = useRef<PointLayer | null>(null);
  const popupRef = useRef<Popup | null>(null);
  const isInitializedRef = useRef(false);
  const latestLocationsRef = useRef<Location[]>(locations);

  // 保持最新数据，避免 scene loaded 回调拿到旧闭包数据
  useEffect(() => {
    latestLocationsRef.current = locations;
  }, [locations]);

  // 初始化地图（只执行一次）
  const initMap = useCallback(() => {
    if (!mapContainerRef.current || isInitializedRef.current) return;

    try {
      const scene = new Scene({
        id: mapContainerRef.current,
        map: new GaodeMap({
          center: [105, 35],
          zoom: 4,
          style: 'light',
        }),
      });

      sceneRef.current = scene;
      isInitializedRef.current = true;
      return scene;
    } catch (error) {
      console.error('地图初始化失败:', error);
      throw error;
    }
  }, []);

  // 创建图层
  const createLayer = useCallback((scene: Scene, data: Location[]) => {
    const pointData = data.map(loc => ({
      lng: loc.lng,
      lat: loc.lat,
      name: loc.name,
      color: loc.color,
      id: loc.id,
    }));

    const pointLayer = new PointLayer()
      .source(pointData, {
        parser: { type: 'json', x: 'lng', y: 'lat' },
      })
      .shape('circle')
      .size(20)
      .color('color', (color: string) => color)
      .style({
        opacity: 0.9,
        strokeWidth: 2,
        stroke: '#ffffff',
      });

    // 点击事件
    pointLayer.on('click', (e: any) => {
      if (popupRef.current) scene.removePopup(popupRef.current);

      const feature = e?.feature;
      if (!feature) return;

      const location: Location = {
        id: feature.id,
        lng: feature.lng,
        lat: feature.lat,
        name: feature.name,
        color: feature.color,
      };
      onLocationClick?.(location);

      const lng = e?.lngLat?.lng ?? feature.lng;
      const lat = e?.lngLat?.lat ?? feature.lat;
      if (typeof lng !== 'number' || typeof lat !== 'number') return;

      popupRef.current = new Popup({
        anchor: 'bottom',
        closeButton: true,
        offset: [0, -40],
        lngLat: { lng, lat },
        title: feature.name ?? '',
        html: `<div style="padding: 12px;">${feature.name ?? ''}</div>`,
      });
      scene.addPopup(popupRef.current);
    });

    scene.addLayer(pointLayer);
    pointLayerRef.current = pointLayer;
  }, [onLocationClick]);

  // 更新数据
  const updateLayers = useCallback((data: Location[]) => {
    const pointLayer = pointLayerRef.current;
    if (!pointLayer) return;

    const pointData = data.map(loc => ({
      lng: loc.lng,
      lat: loc.lat,
      name: loc.name,
      color: loc.color,
      id: loc.id,
    }));
    pointLayer.setData(pointData);
  }, []);

  // 初始化 effect
  useEffect(() => {
    const scene = initMap();
    if (!scene) return;

    scene.on('loaded', () => {
      createLayer(scene, latestLocationsRef.current);
    });

    return () => {
      if (sceneRef.current) {
        if (pointLayerRef.current) {
          sceneRef.current.removeLayer(pointLayerRef.current);
        }
        if (popupRef.current) {
          sceneRef.current.removePopup(popupRef.current);
        }
        sceneRef.current.destroy();
        sceneRef.current = null;
        isInitializedRef.current = false;
      }
    };
  }, []);

  // 数据更新 effect
  useEffect(() => {
    if (isInitializedRef.current && pointLayerRef.current) {
      updateLayers(locations);
    }
  }, [locations]);

  return (
    <div
      ref={mapContainerRef}
      style={{ width: '100%', height: 'min(70vh, 600px)', minHeight: '360px' }}
    />
  );
}
```

## Core Workflow

L7 的典型开发流程：

```
1. 场景初始化 (Scene) → 2. 数据准备 → 3. 创建图层 (Layer) → 4. 添加交互 → 5. 优化性能
```

## 支持的图层类型

### 基础图层

| 图层类型         | 说明   | 适用场景                    |
| ---------------- | ------ | --------------------------- |
| **PointLayer**   | 点图层 | 散点、气泡、符号、文本标注  |
| **LineLayer**    | 线图层 | 路径、弧线、流向线、3D 弧墙 |
| **PolygonLayer** | 面图层 | 区域填充、3D 挤出、海面效果 |
| **HeatmapLayer** | 热力图 | 密度分布、聚合热力          |

### 高级图层

| 图层类型              | 说明        | 适用场景                |
| --------------------- | ----------- | ----------------------- |
| **RasterLayer**       | 栅格图层    | 卫星影像、地形高程      |
| **ImageLayer**        | 图片图层    | 单张图片叠加            |
| **WindLayer**         | 风场图层    | 风向、气流可视化        |
| **CityBuildingLayer** | 建筑图层    | 3D 城市建筑、扫描光效果 |
| **CanvasLayer**       | Canvas 图层 | 自定义 Canvas 绘制      |
| **EarthLayer**        | 地球图层    | 3D 地球、大气层效果     |
| **Marker**            | DOM 标注    | 少量点位、自定义 DOM    |

### PointLayer shape 类型

```typescript
.shape('circle')      // 圆形
.shape('square')      // 方形
.shape('triangle')    // 三角形
.shape('text')        // 文本标注
.shape('image')       // 图片图标
.shape('cylinder')    // 3D 圆柱
```

### LineLayer shape 类型

```typescript
.shape('line')        // 直线
.shape('arc')         // 弧线
.shape('arc3d')       // 3D 弧线
.shape('greatcircle') // 大圆航线
.shape('wall')        // 墙
.shape('flowline')    // 流向线
.shape('dash')        // 虚线
```

## 数据格式

### 支持的解析器类型

| 类型        | parser.type | 数据格式          | 配置示例                                      |
| ----------- | ----------- | ----------------- | --------------------------------------------- |
| **GeoJSON** | `'geojson'` | FeatureCollection | `{ type: 'geojson' }`                         |
| **JSON**    | `'json'`    | Array\<Object\>   | `{ type: 'json', x: 'lng', y: 'lat' }`        |
| **CSV**     | `'csv'`     | CSV 字符串        | `{ type: 'csv', x: 'lng', y: 'lat' }`         |
| **MVT**     | `'mvt'`     | Vector Tile URL   | `{ type: 'mvt', minZoom: 0, maxZoom: 18 }`    |
| **Raster**  | `'raster'`  | 栅格数据          | `{ type: 'raster', width: 100, height: 100 }` |

### 数据变换 (Transforms)

```typescript
.source(data, {
  parser: { type: 'json', x: 'lng', y: 'lat' },
  transforms: [
    // 聚合
    {
      type: 'cluster',
      radius: 80,
      method: 'sum',
      field: 'value'
    },
    // 过滤
    {
      type: 'filter',
      callback: (item) => item.value > 100
    },
  ],
})
```

## 常用控件

```typescript
// L7 2.x 推荐：统一从 @antv/l7 导入
import { Zoom, Fullscreen, LayerSwitch, ExportImage } from '@antv/l7';

// 等价写法：按子包导入（在按需拆包场景下可用）
// import { Zoom, Fullscreen, LayerSwitch, ExportImage } from '@antv/l7-component';

// 缩放控件
scene.addControl(
  new Zoom({
    position: 'bottomright',
    zoomInText: '+',
    zoomOutText: '-',
  }),
);

// 全屏控件
scene.addControl(
  new Fullscreen({
    position: 'topleft',
  }),
);

// 图层切换
scene.addControl(
  new LayerSwitch({
    layers: [layer1, layer2],
    position: 'topright',
  }),
);

// 导出图片
scene.addControl(
  new ExportImage({
    position: 'topright',
    imageType: 'png',
  }),
);
```

## 常用 Scene API

### 地图控制

```typescript
// 设置中心点
scene.setCenter([120.19, 30.26]);

// 设置缩放
scene.setZoom(12);

// 适应边界 - 自动缩放地图以容纳指定范围
scene.fitBounds([
  [minLng, minLat],
  [maxLng, maxLat],
]);

// 完整参数
scene.fitBounds(
  [
    [minLng, minLat],
    [maxLng, maxLat],
  ], // 边界范围 [西南角, 东北角]
  {
    padding: [50, 50, 50, 50], // 内边距 [上, 右, 下, 左]，单位像素
    duration: 500, // 动画时长（毫秒），默认无动画
    maxZoom: 15, // 最大缩放级别限制
  },
);

// 根据数据范围自动适配（配合 Layer 使用）
scene.fitBounds(pointLayer.getBounds());

// 切换地图样式
scene.setMapStyle('dark');

// 获取当前状态
const zoom = scene.getZoom();
const center = scene.getCenter();
```

### 导出功能

```typescript
// 导出为 PNG
const png = await scene.exportPng('png');

// 导出地图（含底图）
const mapImage = await scene.exportMap('png');
```

### 交互方法

```typescript
// 高亮
layer.active({ color: '#ff0000' });

// 选中
layer.select({ color: '#00ff00' });

// 框选
scene.enableBoxSelect(true);
```

## 常见问题

| 问题                | 解决方案                                                                              |
| ------------------- | ------------------------------------------------------------------------------------- |
| 重复初始化          | 使用 `isInitializedRef` 标记 + 空依赖数组                                             |
| 初始化多次（React） | 初始化 `useEffect` 仅用 `[]`；不要依赖 `selectedId`/父回调，状态变化走独立更新 effect |
| 弹窗重复出现        | 统一 `scene.addPopup(...)`；新建前先移除旧 popup；禁止与 `marker.setPopup(...)` 混用  |
| 图层重复创建        | 分离初始化和更新逻辑                                                                  |
| Popup 累积          | 创建前先移除旧 popup                                                                  |
| 清理不完整          | 完整的 cleanup 函数                                                                   |
| 缺少错误处理        | try-catch 包裹初始化                                                                  |
| autoFit 跳动        | 移除 autoFit，手动控制视图                                                            |

## 参考资料

- [L7 官方文档](https://l7.antv.antgroup.com/)
- [L7 API 参考](https://l7.antv.antgroup.com/api)
