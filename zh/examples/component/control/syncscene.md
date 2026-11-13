---
title: "双屏对比"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/component/control/syncscene/"
---

# 双屏对比

[运行示例](https://l7.antv.antgroup.com/zh/examples/component/control/syncscene/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```ts
import { GaodeMap, HeatmapLayer, PointLayer, Scene } from '@antv/l7';
import { isNumber } from 'lodash-es';

// 通过 Scene 获取到地图引擎类型
function getMapType(scene) {
  const mapVersion = scene.getMapService().version;
  return mapVersion?.includes('MAPBOX') ? 'Mapbox' : 'Gaode';
}

// 根据不同地图引擎类型，设置地图的状态「缩放层级、地图中心点、旋转角、倾角」
const updateSceneStatus = (
  scene,
  status = {
    zoom,
    center,
    pitch,
    rotation,
  },
) => {
  const mapType = getMapType(scene);
  const { zoom, center, pitch, rotation } = status;
  if (mapType === 'Gaode') {
    const map = scene?.map;
    // 高德地图关闭动画效果
    if (center) map.setCenter(center, true);
    if (isNumber(zoom)) map?.setZoom(zoom + 1, true);
    if (isNumber(rotation)) map?.setRotation(360 - rotation, true);
    if (isNumber(pitch)) map?.setPitch(pitch, true);
  } else {
    if (isNumber(zoom)) scene?.setZoom(zoom);
    if (center) scene?.setCenter(center);
    if (isNumber(rotation)) scene.setRotation(rotation);
    if (isNumber(pitch)) scene?.setPitch(pitch);
  }
};

export function syncScene(scenes, options = {}) {
  const { zoomGap = 0, mainIndex = 0 } = options ?? {};
  const listeners = [];
  let handlers = [];

  // 添加地图事件监听
  const listen = (index) => {
    const scene = scenes[index];
    scene.on('mapmove', handlers[index]);
    // Gaode 地图调整倾角和旋转角的事件
    scene.on('dragging', handlers[index]);
    // Mapbox 地图调整倾角和旋转角的事件
    scene.on('rotate', handlers[index]);
    scene.on('zoomchange', handlers[index]);

    return () => {
      scene.off('mapmove', handlers[index]);
      scene.off('dragging', handlers[index]);
      scene.off('zoomchange', handlers[index]);
      scene.off('rotate', handlers[index]);
    };
  };

  const clearListener = () => {
    listeners?.forEach((call) => call());
    listeners.length = 0;
  };

  // 根据指定索引的 scene 同步其他 scene 状态
  const moveScenePosition = (index) => {
    const movedScene = scenes[index];
    const center = movedScene.getCenter();
    const zoom = movedScene.getZoom();
    const rotation = movedScene.getRotation();
    const pitch = movedScene.getPitch();
    /**
     * 根据当前地图是否为主地图，分两种情况
     * 1. 非主地图，则其他非主地图 zoom 设置当前 zoom ，主地图设置为 zoom - zoomGap
     * 2. 主地图，则其他非主地图 zoom 设置为 zoom + zoomGap
     */
    const isMovedMainScene = index === mainIndex;
    scenes.forEach((scene, num) => {
      if (num !== index) {
        // 当前需要同步的状态是不是主地图
        const sceneZoom = isMovedMainScene
          ? zoom + zoomGap
          : num === mainIndex
            ? zoom - zoomGap
            : zoom;
        updateSceneStatus(scene, {
          zoom: sceneZoom,
          center: [center.lng, center.lat],
          rotation,
          pitch,
        });
      }
    });
  };

  const syncHandler = (index) => {
    clearListener();
    moveScenePosition(index);
    initListener();
  };

  function initListener() {
    handlers = scenes.map((value, index) => {
      // 每个地图有自己的状态同步函数
      return syncHandler.bind(null, index);
    });
    scenes.forEach((scene, index) => {
      // 给每个地图绑定监听
      listeners.push(listen(index));
    });
  }

  // 初始化,先将所有地图状态同步。
  scenes.forEach((value, index) => {
    moveScenePosition(index);
  });

  // 添加地图事件监听
  initListener();

  // 返回清除绑定的监听事件函数
  return clearListener;
}

const mapDiv = document.getElementById('map');
if (mapDiv) {
  mapDiv.style.cssText = 'display: flex; height: 700px';
  // 创建第一个新div并设置一些属性或内容
  const newMapDiv1 = document.createElement('div');
  newMapDiv1.style.cssText = 'width: 50%; height: 700px; position: relative; margin-right: 5px;';
  newMapDiv1.id = 'map1'; // 给新div设置id

  // 创建第二个新div并设置一些属性或内容
  const newMapDiv2 = document.createElement('div');
  newMapDiv2.style.cssText = 'width: 50%; height: 700px; position: relative;  margin-left: 5px;';
  newMapDiv2.id = 'map2'; // 给新div设置id

  mapDiv.appendChild(newMapDiv1);
  mapDiv.appendChild(newMapDiv2);

  const scene = new Scene({
    id: 'map1',
    map: new GaodeMap({
      pitch: 0,
      style: 'normal',
      center: [114.07737552216226, 22.542656745583486],
      rotation: 90,
      zoom: 12.47985,
    }),
    // 关闭默认 L7 Logo
    logoVisible: false,
  });
  scene.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new PointLayer({})
          .source(data)
          .shape('circle')
          .size('h12', [2, 5])
          .color(
            'h12',
            [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
            ].reverse(),
          );
        scene.addLayer(pointLayer);
      });
  });
  const scene1 = new Scene({
    id: 'map2',
    map: new GaodeMap({
      pitch: 0,
      style: 'normal',
      center: [114.07737552216226, 22.542656745583486],
      rotation: 90,
      zoom: 12.47985,
    }),
    // 关闭默认 L7 Logo
    logoVisible: false,
  });
  scene1.on('loaded', () => {
    fetch('https://gw.alipayobjects.com/os/basement_prod/513add53-dcb2-4295-8860-9e7aa5236699.json')
      .then((res) => res.json())
      .then((data) => {
        const pointLayer = new HeatmapLayer({})
          .source(data, {
            transforms: [
              {
                type: 'hexagon',
                size: 400,
                field: 'h12',
                method: 'sum',
              },
            ],
          })
          .shape('hexagon')
          .style({
            coverage: 0.9,
            angle: 0,
          })

          .color(
            'sum',
            [
              '#094D4A',
              '#146968',
              '#1D7F7E',
              '#289899',
              '#34B6B7',
              '#4AC5AF',
              '#5FD3A6',
              '#7BE39E',
            ].reverse(),
          );
        scene1.addLayer(pointLayer);
      });
  });

  syncScene([scene, scene1]);
}
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/component/control/demo/syncscene.ts" });
```


## src/demo/setup.ts

```ts
import type { DemoSetupContext } from '@antv/astro-theme-antv';
import * as District from 'district-data';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default async function setup({ container, path }: DemoSetupContext) {
  // Tool pages provide their own React layout and SDK imports.
  if (!path.startsWith('/examples/')) return;
  // Retain only the original globals still used by gallery examples.
  Object.assign(window, { District, GLTFLoader });
  const map = document.createElement('div');
  map.id = 'map';
  container.append(map);
  await import('./map.css');
  // Match the original gallery's shared AMap environment, including raw AMap demos.
  await import('./amap');
}
```

## src/demo/map.css

```css
#map {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 320px;
}

.labelclass {
  position: absolute;
  display: inline;
  cursor: pointer;
  background: rgb(255, 228, 120);
  border: solid 2px #fff;
  padding: 4px;
  white-space: nowrap;
  font:
    bold 12px/18px arial,
    sans-serif;
  color: #fff;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  line-height: 30px;
  /* opacity: 0.7; */
  text-align: center;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
```

## src/demo/amap.ts

```ts
import AMapLoader from '@amap/amap-jsapi-loader';

// Preserve the site's development and production SDK registrations.
const credentials = import.meta.env.DEV
  ? { key: '6f025e700cbacbb0bb866712d20bb35c', securityJsCode: '290ddc4b0d33be7bc9b354bc6a4ca614' }
  : { key: 'f59bcf249433f8b05caaee19f349b3d7', securityJsCode: '2653011adeb04230b3a26cc9a780a800' };
window._AMapSecurityConfig = { securityJsCode: credentials.securityJsCode };
await AMapLoader.load({ key: credentials.key, version: '2.0', plugins: ['Map3D'] });
```
