### threejs - amap1
```tsx
import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import React, { useEffect } from 'react';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { animate, easeInOut } from 'popmotion';

export default () => {
    useEffect(() => {
      const scene = new Scene({
        id: 'map',
        map: new GaodeMap({
          center: [111.4453125, 32.84267363195431],
          pitch: 45,
          rotation: 30,
          zoom: 10,
        }),
      });
      scene.registerRenderService(ThreeRender);
      scene.on('loaded', () => {
        const threeJSLayer = new ThreeLayer({
          enableMultiPassRenderer: false,
          // @ts-ignore
          onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
            threeScene.add(new THREE.AmbientLight(0xffffff));
            const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
            sunlight.position.set(0, 80000000, 100000000);
            sunlight.matrixWorldNeedsUpdate = true;
            threeScene.add(sunlight);

            let center = scene.getCenter();
            let cubeGeometry = new THREE.BoxBufferGeometry(10000, 10000, 10000);
            let cubeMaterial = new THREE.MeshNormalMaterial();
            let cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            layer.setObjectLngLat(cube, [center.lng + 0.05, center.lat], 0);
            threeScene.add(cube);

            // 使用 Three.js glTFLoader 加载模型
            const loader = new GLTFLoader();
            loader.load(
              'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
              (gltf) => {
                // 根据 GeoJSON 数据放置模型
                const gltfScene = gltf.scene;

                layer.adjustMeshToMap(gltfScene);
                layer.setMeshScale(gltfScene, 1000, 1000, 1000);

                layer.setObjectLngLat(
                  gltfScene,
                  [ center.lng, center.lat ],
                  0,
                );

                const animations = gltf.animations;
                if (animations && animations.length) {
                  const mixer = new THREE.AnimationMixer(gltfScene);
                  const animation = animations[2];
                  const action = mixer.clipAction(animation);
                  action.play();
                  layer.addAnimateMixer(mixer);
                }
                // 向场景中添加模型
                threeScene.add(gltfScene);
                
                // 重绘图层
                layer.render();
              },
            );
          },
        })
        .animate(true);
        scene.addLayer(threeJSLayer);
      });
    }, [])
    return (
        <div
            id="map"
            style={{
                height:'500px',
                position: 'relative'
            }}
        />
    );
}

```