import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new Scene({
  id: 'map',
  map: new GaodeMap({
    center: [ 111.4453125, 32.84267363195431 ],
    pitch: 45,
    rotation: 30,
    zoom: 12
  })
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
      layer.setObjectLngLat(cube, [ center.lng + 0.05, center.lat ], 0);
      threeScene.add(cube);

      // 使用 Three.js glTFLoader 加载模型
      const loader = new GLTFLoader();
      loader.load(
        'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
        gltf => {
          const gltfScene = gltf.scene;
          setDouble(gltfScene);
          layer.adjustMeshToMap(gltfScene);
          // gltfScene.scale.set(1000, 1000, 1000)
          layer.setMeshScale(gltfScene, 1000, 1000, 1000);

          layer.setObjectLngLat(
            gltfScene,
            [ center.lng, center.lat ],
            0
          );

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
            layer.setObjectLngLat(
              gltfScene,
              [ center.lng, center.lat + Math.sin(t) * 0.1 ],
              0
            );
          }, 16);

          // 向场景中添加模型
          threeScene.add(gltfScene);
          // 重绘图层
          layer.render();
        }
      );
    }
  }).animate(true);
  scene.addLayer(threeJSLayer);
});

function setDouble(object) {
  if (object.children && object.children.length && object.children.length > 0) {
    object.children.map(child => setDouble(child));
  } else if (object.material) {
    object.material.side = THREE.DoubleSide;
  }
}

