import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
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
      id: 'map',
      map: new Mapbox({
        center: [120.19382669582967, 30.258134],
        pitch: 0,
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 1,
      }),
    });
    const pointLayer = new PointLayer();
    scene.on('resize', () => {
      console.log('resize');
    });
    pointLayer
      .source(data, {
        cluster: true,
      })
      .color('red')
      .shape('cylinder')
      .active({ color: 'blue' })
      .size([15, 10]);
    scene.addLayer(pointLayer);
    setTimeout(() => {
      pointLayer.size([20, 100]);
      scene.render();
    }, 2000);
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
