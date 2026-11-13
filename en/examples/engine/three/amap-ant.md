---
title: "高德地图"
language: "en"
canonical: "https://l7.antv.antgroup.com/en/examples/engine/three/amap-ant/"
---

# 高德地图

[Live example](https://l7.antv.antgroup.com/en/examples/engine/three/amap-ant/)

[Resource index](/llms.txt)

Provide a DOM element with `id="container"`. The original example source follows.

## Source

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
  }),
});

scene.on('loaded', () => {
  scene.registerRenderService(ThreeRender);

  const threeJSLayer = new ThreeLayer({
    enableMultiPassRenderer: false,
    onAddMeshes: (threeScene, layer) => {
      threeScene.add(new THREE.AmbientLight(0xffffff));
      const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
      sunlight.position.set(0, 80000000, 100000000);
      sunlight.matrixWorldNeedsUpdate = true;
      threeScene.add(sunlight);

      const center = scene.getCenter();

      const cubeGeometry = new THREE.BoxBufferGeometry(10000, 10000, 10000);
      const cubeMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide });
      const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
      layer.setObjectLngLat(cube, [center.lng + 0.05, center.lat], 0);
      threeScene.add(cube);

      // 使用 Three.js glTFLoader 加载模型
      const loader = new window.GLTFLoader();
      loader.load(
        'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
        (gltf) => {
          const gltfScene = gltf.scene;
          setDouble(gltfScene);
          layer.adjustMeshToMap(gltfScene);
          // gltfScene.scale.set(1000, 1000, 1000)
          layer.setMeshScale(gltfScene, 1000, 1000, 1000);

          layer.setObjectLngLat(gltfScene, [center.lng, center.lat], 0);

          const animations = gltf.animations;
          if (animations && animations.length) {
            const mixer = new THREE.AnimationMixer(gltfScene);

            const animation = animations[2];

            const action = mixer.clipAction(animation);

            action.play();
            layer.addAnimateMixer(mixer);
          }
          // layer.setObjectLngLat(gltfScene, [center.lng + 0.05, center.lat] as ILngLat, 0)
          let t = 0;
          setInterval(() => {
            t += 0.01;
            layer.setObjectLngLat(gltfScene, [center.lng, center.lat + Math.sin(t) * 0.1], 0);
          }, 16);

          // 向场景中添加模型
          threeScene.add(gltfScene);
          // 重绘图层
          layer.render();
        },
      );
    },
  }).animate(true);
  scene.addLayer(threeJSLayer);
});

function setDouble(object) {
  if (object.children && object.children.length && object.children.length > 0) {
    object.children.map((child) => setDouble(child));
  } else if (object.material) {
    object.material.side = THREE.DoubleSide;
  }
}
```

## Runtime environment

Before evaluating the example, await this setup in a page containing #container. Supporting files follow below.

```js
await (await import("/src/demo/setup.ts")).default({ container: document.getElementById('container'), path: "/examples/engine/three/demo/amap-ant.js" });
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
