import { GeometryLayer, Scene, IMapService } from '@antv/l7';
import { GaodeMap, Mapbox, GaodeMapV2 } from '@antv/l7-maps';
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
        pitch: 60,
        center: [120.1025, 30.2594],
        rotation: 220,
        zoom: 14,
      }),
    });
    this.scene = scene;

    let layer = new GeometryLayer()
      .style({
        width: 0.074,
        height: 0.061,
        center: [120.1025, 30.2594],
        widthSegments: 200,
        heightSegments: 200,
        terrainClipHeight: 1,
        mapTexture:
          'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
        terrainTexture:
          'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ',
        rgb2height: (r: number, g: number, b: number) => {
          let h =
            -10000.0 +
            (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) * 0.1;
          h = h / 20 - 127600;
          h = Math.max(0, h);
          return h;
        },
      })
      .color('#ff0');

    scene.on('loaded', () => {
      scene.addLayer(layer);
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
