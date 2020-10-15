import { LineLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class DashLineDemo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/ZVfOvhVCzwBkISNsuKCc.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [102.602992, 23.107329],
        pitch: 0,
        style: 'light',
        zoom: 14,
      }),
    });
    const lineLayer = new LineLayer({
      pickingBuffer: 5,
    })
      .source(await response.json())
      .size(1)
      .shape('line')
      .active({ color: 'red' })
      .color(
        'ELEV',
        [
          '#E8FCFF',
          '#CFF6FF',
          '#A1E9ff',
          '#65CEF7',
          '#3CB1F0',
          '#2894E0',
          '#1772c2',
          '#105CB3',
          '#0D408C',
          '#002466',
        ].reverse(),
      )
      .style({
        // lineType: 'dash',
        // dashArray: [4, 2, 2, 2],
        opacity: 1.0,
      });

    scene.addLayer(lineLayer);
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
