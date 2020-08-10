import { Scene } from '@antv/l7';
import { DrawControl } from '@antv/l7-draw';
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
        style: 'mapbox://styles/mapbox/satellite-v9', // hosted style id
        center: [-91.874, 42.76], // starting position
        zoom: 12, // starting zoom
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const drawControl = new DrawControl(scene, {
        position: 'topright',
        layout: 'horizontal', // horizontal vertical
        controls: {
          point: true,
          polygon: true,
          line: true,
          circle: true,
          rect: true,
          delete: true,
        },
      });
      scene.on('click', () => {});
      drawControl.on('draw.update', (e: any) => {
        console.log('update', e);
      });
      scene.addControl(drawControl);
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
