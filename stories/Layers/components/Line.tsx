import { LineLayer, Scene } from '@antv/l7';
import { Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class LineDemo extends React.Component {
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
      map: new Mapbox({
        center: [102.602992, 23.107329],
        pitch: 0,
        style: 'mapbox://styles/mapbox/dark-v9',
        zoom: 13,
      }),
    });
    const lineLayer = new LineLayer()
      .source(await response.json())
      .size(1)
      .shape('line')
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
      .animate({
        interval: 0.1,
        trailLength: 0.05,
        duration: 2,
      })
      .style({
        lineType: 'solid',
      });

    scene.addLayer(lineLayer);
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
