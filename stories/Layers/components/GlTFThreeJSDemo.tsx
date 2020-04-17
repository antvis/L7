import { Scene, ThreeJSLayer } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import { DirectionalLight, Matrix4, Scene as ThreeScene } from 'three';
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
        center: [121.434765, 31.256735],
        pitch: 45,
        rotation: 30,
        zoom: 18,
      }),
    });
    this.scene = scene;

    const threeJSLayer = new ThreeJSLayer({
      enableMultiPassRenderer: false,
      onAddMeshes: (threeScene: ThreeScene, layer: ThreeJSLayer) => {
        // 添加光源
        const directionalLight1 = new DirectionalLight(0xffffff);
        directionalLight1.position.set(0, -70, 100).normalize();
        threeScene.add(directionalLight1);
        const directionalLight2 = new DirectionalLight(0xffffff);
        directionalLight2.position.set(0, 70, 100).normalize();
        threeScene.add(directionalLight2);

        // 使用 Three.js glTFLoader 加载模型
        const loader = new GLTFLoader();
        loader.load(
          // 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/DamagedHelmet/glTF/DamagedHelmet.gltf',
          // 'https://raw.githubusercontent.com/KhronosGroup/glTF-Sample-Models/master/2.0/AnimatedCube/glTF/AnimatedCube.gltf',
          'https://gw.alipayobjects.com/os/antvdemo/assets/gltf/radar/34M_17.gltf',
          // 'https://gw.alipayobjects.com/os/bmw-prod/3ca0a546-92d8-4ba0-a89c-017c218d5bea.gltf',
          (gltf) => {
            // 根据 GeoJSON 数据放置模型
            layer.getSource().data.dataArray.forEach(({ coordinates }) => {
              const gltfScene = gltf.scene.clone();
              gltfScene.applyMatrix(
                // 生成模型矩阵
                layer.getModelMatrix(
                  [coordinates[0], coordinates[1]], // 经纬度坐标
                  0, // 高度，单位米
                  [Math.PI / 2, 0, 0], // 沿 XYZ 轴旋转角度
                  [5, 5, 5], // 沿 XYZ 轴缩放比例
                ),
              );
              // 向场景中添加模型
              threeScene.add(gltfScene);
            });
            // 重绘图层
            layer.render();
          },
        );
      },
    }).source(pointsData, {
      parser: {
        type: 'json',
        x: 'longitude',
        y: 'latitude',
      },
    });
    scene.addLayer(threeJSLayer);
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
