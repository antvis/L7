import { LineLayer, PointLayer, PolygonLayer, Popup, Scene } from '@antv/l7';
import { DrawCircle } from '@antv/l7-draw';
import { GaodeMap, Mapbox } from '@antv/l7-maps';

import * as React from 'react';
export default class Circle extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        pitch: 0,
        style: 'normal',
        center: [121.775374, 31.31067],
        zoom: 15,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const drawCircle = new DrawCircle(scene);
      drawCircle.enable();
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
