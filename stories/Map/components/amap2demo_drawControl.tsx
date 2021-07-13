import { Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import { DrawControl } from '@antv/l7-draw';
import * as React from 'react';
export default class Amap2demo_drawControl extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'light',
        layers: [],
        center: [116.1608, 40.1119],
        zoom: 15,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      // const layer1 = new AMap.TileLayer.Satellite();
      // scene.map.setLayers([]);
      // layer1.setMap(scene.map);
      const drawControl = new DrawControl(scene, {
        // position: 'topright',
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
      scene.addControl(drawControl);
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
