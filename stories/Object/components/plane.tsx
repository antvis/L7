import { GeometryLayer, Scene, IMapService } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      // map: new GaodeMap({
      map: new GaodeMapV2({
        // map: new Mapbox({
        pitch: 0,
        // style: 'dark',
        center: [120, 30],
        zoom: 5,
      }),
    });
    this.scene = scene;

    let layer = new GeometryLayer()
      .style({
        width: 2,
        height: 2,
        opacity: 0.8,
        widthSegments: 3,
        heightSegments: 3,
        center: [120, 30],
        cursor: 'pointer',
        cursorEnabled: true,
        // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FG4fT7h5AYMAAAAAAAAAAAAAARQnAQ'
      })
      .active({
        color: '#00f',
        mix: 0.5,
      })
      .color('#ff0');

    let layer2 = new GeometryLayer()
      .style({
        width: 2,
        height: 2,
        opacity: 0.8,
        widthSegments: 3,
        heightSegments: 3,
        center: [125, 30],
        cursor: 'wait',
        cursorEnabled: true,
        // mapTexture: 'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*FG4fT7h5AYMAAAAAAAAAAAAAARQnAQ'
      })
      .active({
        color: '#00f',
        mix: 0.5,
      })
      .color('#ff0');

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(layer2);

      // setTimeout(() => {
      //   // layer.style({
      //   //   mapTexture: ""
      //   // })
      //   layer.style({
      //     mapTexture:
      //       'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*GJhASbfQTK8AAAAAAAAAAAAAARQnAQ',
      //   });
      //   scene.render();
      // }, 2000);
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
