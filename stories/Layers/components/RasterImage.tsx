import { ImageLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ImageLayerDemo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'mapbox://styles/mapbox/streets-v9',
        zoom: 10,
      }),
    });
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
