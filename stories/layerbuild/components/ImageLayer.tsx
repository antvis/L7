// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { ImageLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.168, 30.2828],
        zoom: 8,
      }),
    });

    const layer = new ImageLayer({});
    layer.source(
      'https://gw.alipayobjects.com/zos/rmsportal/FnHFeFklTzKDdUESRNDv.jpg',
      {
        parser: {
          type: 'image',
          extent: [ 121.168, 30.2828, 121.384, 30.4219 ]
        }
      }
    );

    scene.on('loaded', () => {
      scene.addLayer(layer);
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
      ></div>
    );
  }
}
