---
title: "基础图形与光照"
language: "zh"
canonical: "https://l7.antv.antgroup.com/zh/examples/engine/three/basic-geometry/"
---

# 基础图形与光照

[运行示例](https://l7.antv.antgroup.com/zh/examples/engine/three/basic-geometry/)

[资料索引](/llms.txt)

页面需要一个 `id="container"` 的 DOM 元素。以下为原始示例源码。

## 源码

```js
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [111.4453125, 32.84267363195431],
    pitch: 45,
    rotation: 30,
    zoom: 12,
    mapStyle: 'amap://styles/darkblue',
  }),
});

scene.on('loaded', () => {
  scene.registerRenderService(ThreeRender);

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      // 当前场景的中心
      const center = scene.getCenter();

      // 环境光照
      threeScene.add(new THREE.AmbientLight(0xffffff, 0.2));
      const sunlight = new THREE.DirectionalLight(0xff0000, 0.8);
      layer.setObjectLngLat(sunlight, [center.lng + 0.3, center.lat + 0.08], 1000);
      sunlight.matrixWorldNeedsUpdate = true;
      threeScene.add(sunlight);

      const directionalLightHelper = new THREE.DirectionalLightHelper(sunlight, 5);
      threeScene.add(directionalLightHelper);

      const box = createBoxGeometry();
      box.scale.set(1000, 1000, 1000);
      box.rotation.set(0, 90, 0);
      layer.setObjectLngLat(box, [center.lng - 0.05, center.lat], 0);
      threeScene.add(box);

      const circle = createCircleGeometry();
      circle.scale.set(100, 100, 1000);
      layer.setObjectLngLat(circle, [center.lng - 0.03, center.lat], 0);
      threeScene.add(circle);

      const cylinder = createCylinderGeometry();
      cylinder.scale.set(100, 100, 100);
      layer.setObjectLngLat(cylinder, [center.lng - 0.015, center.lat], 0);
      threeScene.add(cylinder);

      const cone = createConeGeometry();
      cone.scale.set(100, 100, 100);
      layer.setObjectLngLat(cone, [center.lng + 0.01, center.lat], 0);
      threeScene.add(cone);

      const plane = createPlaneGeometry();
      plane.scale.set(1000, 1000, 1000);
      layer.setObjectLngLat(plane, [center.lng + 0.03, center.lat], 0);
      threeScene.add(plane);

      const shape = createShape();
      shape.scale.set(100, 100, 100);
      layer.setObjectLngLat(shape, [center.lng + 0.03, center.lat], 0);
      threeScene.add(shape);

      const sphere = createSphereGeometry();
      sphere.scale.set(10, 10, 10);
      layer.setObjectLngLat(sphere, [center.lng + 0.07, center.lat], 0);
      threeScene.add(sphere);

      const tube = createTube();
      tube.scale.set(100, 100, 100);
      layer.setObjectLngLat(tube, [center.lng + 0.07, center.lat], 0);
      threeScene.add(tube);

      const points = createPoints();
      points.scale.set(100, 100, 100);
      layer.setObjectLngLat(points, [center.lng + 0.11, center.lat], 0);
      threeScene.add(points);

      const line = createLine();
      line.scale.set(100, 100, 100);
      layer.setObjectLngLat(line, [center.lng + 0.13, center.lat], 0);
      threeScene.add(line);

      const camera = layer.threeRenderService.getRenderCamera();
      const cameraHelper = createCameraHelper(camera);
      layer.setObjectLngLat(plane, [center.lng, center.lat], 0);
      threeScene.add(cameraHelper);
    },
  }).animate(true);
  scene.addLayer(threeJSLayer);
});

function createBoxGeometry() {
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const cube = new THREE.Mesh(geometry, material);
  return cube;
}

function createCircleGeometry() {
  const geometry = new THREE.CircleGeometry(5, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const circle = new THREE.Mesh(geometry, material);
  return circle;
}

function createCylinderGeometry() {
  const geometry = new THREE.CylinderGeometry(5, 5, 20, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const cylinder = new THREE.Mesh(geometry, material);
  return cylinder;
}

function createConeGeometry() {
  const geometry = new THREE.ConeGeometry(5, 20, 32);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const cone = new THREE.Mesh(geometry, material);
  return cone;
}

function createPlaneGeometry() {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const plane = new THREE.Mesh(geometry, material);
  return plane;
}

function createShape() {
  const x = 0,
    y = 0;

  const heartShape = new THREE.Shape();

  heartShape.moveTo(x + 5, y + 5);
  heartShape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
  heartShape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
  heartShape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
  heartShape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
  heartShape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
  heartShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

  const geometry = new THREE.ShapeGeometry(heartShape);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createSphereGeometry() {
  const geometry = new THREE.SphereGeometry(15, 32, 16);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const sphere = new THREE.Mesh(geometry, material);
  return sphere;
}

function createTube() {
  class CustomSinCurve extends THREE.Curve {
    constructor(scale = 1) {
      super();
      this.scale = scale;
    }

    getPoint(t, optionalTarget = new THREE.Vector3()) {
      const tx = t * 3 - 1.5;
      const ty = Math.sin(2 * Math.PI * t);
      const tz = 0;
      return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
    }
  }

  const path = new CustomSinCurve(10);
  const geometry = new THREE.TubeGeometry(path, 20, 2, 8, false);
  const material = new THREE.MeshPhongMaterial({
    color: 0xffffff,
    reflectivity: 0.8,
    shininess: 80,
    emissive: 0x049ef4,
    specular: 0x049ef4,
  });
  const mesh = new THREE.Mesh(geometry, material);
  return mesh;
}

function createCameraHelper(camera = undefined) {
  const cameraObj =
    camera ?? new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const helper = new THREE.CameraHelper(cameraObj);
  return helper;
}

function createPoints() {
  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({ size: 200, color: 0x049ef4 });
  const pointsGeometry = new THREE.Points(geometry, material);
  return pointsGeometry;
}

function createLine() {
  const material = new THREE.LineBasicMaterial({
    color: 0x049ef4,
    linewidth: 6,
  });

  const points = [];
  points.push(new THREE.Vector3(-10, 0, 0));
  points.push(new THREE.Vector3(0, 10, 0));
  points.push(new THREE.Vector3(10, 0, 0));

  const geometry = new THREE.BufferGeometry().setFromPoints(points);

  const line = new THREE.Line(geometry, material);
  return line;
}
```

## 运行环境

运行示例前，先在含有 #container 的页面中等待以下初始化完成。相关文件附于文末。

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/engine/three/demo/basic-geometry.js" });
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
