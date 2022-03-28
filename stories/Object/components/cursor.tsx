import { GeometryLayer, PointLayer, Scene, IMapService } from '@antv/l7';
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
      map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Mapbox({
        pitch: 0,
        // style: 'dark',
        center: [120, 30],
        zoom: 5,
      }),
    });
    this.scene = scene;
    let pointLayer = new PointLayer()
      .source([{ lng: 120, lat: 33 }], {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(20)
      .color('#f00')
      .active(true)
      .style({
        cursor: 'move',
        cursorEnabled: true,
      });

    let layer0 = new GeometryLayer()
      .style({
        width: 2,
        height: 2,
        opacity: 0.8,
        widthSegments: 3,
        heightSegments: 3,
        center: [115, 30],
        cursor:
          "url('https://gw.alipayobjects.com/zos/bmw-prod/e2421e49-87b0-4b4d-aef7-03f4f93f0b54.ico'),pointer",
        cursorEnabled: true,
      })
      .active({
        color: '#00f',
        mix: 0.5,
      })
      .color('#ff0');

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
      })
      .active({
        color: '#00f',
        mix: 0.5,
      })
      .color('#ff0');

    scene.on('loaded', () => {
      scene.addLayer(pointLayer);
      scene.addLayer(layer0);
      scene.addLayer(layer);
      scene.addLayer(layer2);
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
