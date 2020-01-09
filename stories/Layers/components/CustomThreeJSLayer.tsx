import { PointLayer, Scene, ThreeJSLayer } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
import {
  BackSide,
  BoxGeometry,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  Scene as ThreeScene,
} from 'three';
// @ts-ignore
import data from '../data/data.json';

export default class ThreeJSLayerComponent extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
    );
    const pointsData = await response.json();

    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [120.19382669582967, 30.258134],
        pitch: 60,
        rotation: 30,
        zoom: 16,
      }),
    });
    this.scene = scene;

    // const pointLayer = new PointLayer({})
    //   .source(pointsData, {
    //     cluster: true,
    //   })
    //   .shape('circle')
    //   .scale('point_count', {
    //     type: 'quantile',
    //   })
    //   .size('point_count', [5, 10, 15, 20, 25])
    //   .color('red')
    //   .style({
    //     opacity: 0.3,
    //     strokeWidth: 1,
    //   });
    // scene.addLayer(pointLayer);

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

        const geometry = new BoxGeometry(20, 20, 20);
        const redMaterial = new MeshLambertMaterial({
          color: 0xffffff,
          side: BackSide,
        });
        const cube = new Mesh(geometry, redMaterial);
        cube.applyMatrix(
          layer.getModelMatrix([120.19382669582967, 30.258134], 10, [0, 0, 0]),
        );
        cube.frustumCulled = false;
        threeScene.add(cube);
      },
    }).source(pointsData);
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
