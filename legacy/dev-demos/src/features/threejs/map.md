### threejs - Map

```tsx
import { Scene, RasterLayer } from '@antv/l7';
import { Map } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { animate, easeInOut } from 'popmotion';

export default () => {
  useEffect(() => {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [111.4453125, 32.84267363195431],
        pitch: 45,
        rotation: 30,
        zoom: 12,
        token:
          'pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2w3dHk3dnN4MDYzaDNycDkyMDl2bzh6NiJ9.YIrG9kwUpayLj01f6W23Gw',
      }),
    });

    scene.on('loaded', () => {
      scene.registerRenderService(ThreeRender);
      const url1 =
        'https://tiles{1-3}.geovisearth.com/base/v1/ter/{z}/{x}/{y}?format=webp&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
      const url2 =
        'https://tiles{1-3}.geovisearth.com/base/v1/cat/{z}/{x}/{y}?format=png&tmsIds=w&token=b2a0cfc132cd60b61391b9dd63c15711eadb9b38a9943e3f98160d5710aef788';
      const layer1 = new RasterLayer({
        zIndex: 1,
      }).source(url1, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      });

      const layer2 = new RasterLayer({
        zIndex: 1,
      }).source(url2, {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          zoomOffset: 0,
        },
      });
      scene.addLayer(layer1);
      scene.addLayer(layer2);
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
          const cubeMaterial = new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide,
          });
          const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
          layer.setObjectLngLat(cube, [center.lng + 0.05, center.lat], 0);
          threeScene.add(cube);

          // 使用 Three.js glTFLoader 加载模型
          const loader = new GLTFLoader();
          loader.load(
            'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
            (gltf) => {
              const gltfScene = gltf.scene;
              setDouble(gltfScene);
              layer.adjustMeshToMap(gltfScene);
              // gltfScene.scale.set(1000, 1000, 1000)
              layer.setMeshScale(gltfScene, 100, 100, 100);

              layer.setObjectLngLat(gltfScene, [center.lng, center.lat], 0);

              const animations = gltf.animations;
              if (animations && animations.length) {
                const mixer = new THREE.AnimationMixer(gltfScene);

                const animation = animations[2];

                const action = mixer.clipAction(animation);

                action.play();
                layer.addAnimateMixer(mixer);
              }
              let t = 0;
              setInterval(() => {
                t += 0.01;
                layer.setObjectLngLat(
                  gltfScene,
                  [center.lng, center.lat + Math.sin(t) * 0.1],
                  0,
                );
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
      if (
        object.children &&
        object.children.length &&
        object.children.length > 0
      ) {
        object.children.map((child) => setDouble(child));
      } else if (object.material) {
        object.material.side = THREE.DoubleSide;
      }
    }
  }, []);
  return (
    <div
      id="map"
      style={{
        height: '500px',
        position: 'relative',
      }}
    />
  );
};
```
