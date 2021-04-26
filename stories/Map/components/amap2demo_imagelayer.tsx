import { ImageLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMap2, Mapbox } from '@antv/l7-maps';
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
      map: new GaodeMap2({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 10,
      }),
    });
    this.scene = scene;

    scene.on('loaded', () => {
      const layer = new ImageLayer({});
      layer.source(
        'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
        {
          parser: {
            type: 'image',
            extent: [121.168, 30.2828, 121.384, 30.4219],
          },
        },
      );
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
