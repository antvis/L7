import { ImageLayer } from '@antv/l7-layers';
import { Scene } from '@antv/l7-scene';
import * as React from 'react';

export default class ImageLayerDemo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public componentDidMount() {
    const scene = new Scene({
      center: [121.2680,30.3628],
      id: 'map',
      pitch: 0,
      type: 'mapbox',
      style: 'mapbox://styles/mapbox/streets-v9',
      zoom: 10,
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
