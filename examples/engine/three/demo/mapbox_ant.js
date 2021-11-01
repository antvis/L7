import { Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const scene = new Scene({
  id: 'map',
  map: new Mapbox({
    center: [ 121.4, 31.258134 ],
    pitch: 45,
    rotation: 30,
    zoom: 15
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
      // 使用 Three.js glTFLoader 加载模型

      const loader = new GLTFLoader();
      loader.load(
        'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
        gltf => {
          // 根据 GeoJSON 数据放置模型
          layer.getSource().data.dataArray.forEach(() => {
            const gltfScene = gltf.scene;

            layer.adjustMeshToMap(gltfScene);
            layer.setMeshScale(gltfScene, 10, 10, 10);

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
          });
          // 重绘图层
          layer.render();
        }
      );
    }
  })
    .source({
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Point',
            coordinates: [ 121.4, 31.258134 ]
          }
        }
      ]
    })
    .animate(true);
  scene.addLayer(threeJSLayer);
});
