// @ts-ignore
import { ImageLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_imageLayer extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 10,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const layer = new ImageLayer({});
      layer
        .source(
          // 'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
          'https://gw.alipayobjects.com/mdn/rms_816329/afts/img/A*Al3JR5Hdg0cAAAAAAAAAAAAAARQnAQ',
          {
            parser: {
              type: 'image',
              extent: [121.168, 30.2828, 121.384, 30.4219],
            },
          },
        )
        .shape('dataImage')
        .style({
          // clampLow: false,
          // clampHigh: false,
          // opacity: 0.8,
          domain: [0, 8000],
          rampColors: {
            colors: [
              '#FF4818',
              '#F7B74A',
              '#FFF598',
              '#91EABC',
              '#2EA9A1',
              '#206C7C',
            ].reverse(),
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
          // float value = u_pixelConstant + ((r * u_pixelConstantR + g * u_pixelConstantG + b * u_pixelConstantB) * u_pixelConstantRGB);
          pixelConstant: 0.0,
          pixelConstantR: 256 * 256,
          pixelConstantG: 256,
          pixelConstantB: 1,
          pixelConstantRGB: 0.1,
        });
      scene.addLayer(layer);
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
