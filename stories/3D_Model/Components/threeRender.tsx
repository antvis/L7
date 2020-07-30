import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import { ThreeLayer, ThreeRender } from '@antv/l7-three';
import * as React from 'react';
// import { DirectionalLight, Scene as ThreeScene } from 'three';
import * as THREE from 'three';
// tslint:disable-next-line:no-submodule-imports
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export default class GlTFThreeJSDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
    );
    const pointsData = await response.json();

    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.4, 31.258134],
        pitch: 45,
        rotation: 30,
        zoom: 15,
      }),
    });
    scene.registerRenderService(ThreeRender);
    this.scene = scene;
    scene.on('loaded', async () => {
      // scene.registerRenderService(ThreeRender);
      const response = await fetch(
        'https://gw.alipayobjects.com/os/basement_prod/893d1d5f-11d9-45f3-8322-ee9140d288ae.json',
      );
      scene.addImage(
        '00',
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*Rq6tQ5b4_JMAAAAAAAAAAABkARQnAQ',
      );
      scene.addImage(
        '01',
        'https://gw.alipayobjects.com/mdn/antv_site/afts/img/A*0D0SQ6AgkRMAAAAAAAAAAABkARQnAQ',
      );
      scene.addImage(
        '02',
        'https://gw.alipayobjects.com/zos/rmsportal/xZXhTxbglnuTmZEwqQrE.png',
      );
      const data = await response.json();
      const imageLayer = new PointLayer()
        .source(data, {
          parser: {
            type: 'json',
            x: 'longitude',
            y: 'latitude',
          },
        })
        // .shape('name', ['00', '01', '02'])
        .shape('triangle')
        .color('red')
        .active(true)
        .size(20);
      scene.addLayer(imageLayer);

      const threeJSLayer = new ThreeLayer({
        enableMultiPassRenderer: false,
        onAddMeshes: (threeScene: THREE.Scene, layer: ThreeLayer) => {
          threeScene.add(new THREE.AmbientLight(0xffffff));
          const sunlight = new THREE.DirectionalLight(0xffffff, 0.25);
          sunlight.position.set(0, 80000000, 100000000);
          sunlight.matrixWorldNeedsUpdate = true;
          threeScene.add(sunlight);
          // 使用 Three.js glTFLoader 加载模型
          const loader = new GLTFLoader();
          loader.load(
            // 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
            // 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf',
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/radar/34M_17.gltf',
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/duck/Duck.gltf', // duck
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/truck/CesiumMilkTruck.gltf', // Truck
            // 'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/man/CesiumMan.gltf',
            'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
            (gltf) => {
              // 根据 GeoJSON 数据放置模型
              layer.getSource().data.dataArray.forEach(({ coordinates }) => {
                const gltfScene = gltf.scene;
                gltfScene.applyMatrix4(
                  // 生成模型矩阵
                  layer.getModelMatrix(
                    [coordinates[0], coordinates[1]], // 经纬度坐标
                    0, // 高度，单位米/
                    [Math.PI / 2, -Math.PI, 0], // 沿 XYZ 轴旋转角度
                    [10, 10, 10], // 沿 XYZ 轴缩放比例
                  ),
                );
                const animations = gltf.animations;
                if (animations && animations.length) {
                  const mixer = new THREE.AnimationMixer(gltfScene);
                  // @ts-ignore
                  // for (let i = 0; i < 1; i++) {
                  const animation = animations[2];

                  // There's .3333 seconds junk at the tail of the Monster animation that
                  // keeps it from looping cleanly. Clip it at 3 seconds

                  const action = mixer.clipAction(animation);

                  action.play();
                  // }
                  layer.addAnimateMixer(mixer);
                }

                // 向场景中添加模型
                threeScene.add(gltfScene);
              });
              // 重绘图层
              layer.render();
            },
          );
        },
      })
        .source({
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'Point',
                coordinates: [121.4, 31.258134],
              },
            },
          ],
        })
        .animate(true);
      scene.addLayer(threeJSLayer);
    });
  }

  public render() {
    return (
      <div
        id="map"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
      />
    );
  }
}
