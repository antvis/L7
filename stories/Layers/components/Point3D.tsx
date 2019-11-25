import { PointLayer, Scene } from '@antv/l7';
import * as React from 'react';
// @ts-ignore
import data from '../data/data.json';
export default class Point3D extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      center: [120.19382669582967, 30.258134],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 1,
    });
    const pointLayer = new PointLayer({
      enablePicking: true,
      enableHighlight: true,
      enableTAA: true,
      onHover: (pickedFeature: any) => {
        // tslint:disable-next-line:no-console
        console.log('Scene4', pickedFeature.feature.name);
      },
    });
    pointLayer
      .source(data)
      .color('red')
      .shape('cylinder')
      .size([15, 10]);
    scene.addLayer(pointLayer);
    scene.render();
    this.scene = scene;
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
