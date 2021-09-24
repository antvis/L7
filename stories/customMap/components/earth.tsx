// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, EarthLayer } from '@antv/l7-layers';
import { Earth } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Earth({
        center: [120, 30],
        pitch: 0,
        zoom: 3,
      }),
    });

    let pointlayer = new PointLayer()
      .source(
        [
          {
            lng: 121.107846,
            lat: 30.267069,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      )
      .shape('circle')
      .color('rgba(255, 0, 0, 1.0)')
      .size(20);

    const layer = new EarthLayer()
      .source(
        'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*3-3NSpqRqUoAAAAAAAAAAAAAARQnAQ',
        {
          parser: {
            type: 'image',
            extent: [121.168, 30.2828, 121.384, 30.4219],
          },
        },
      )
      .color('#2E8AE6')
      .shape('fill')
      .style({
        opacity: 1.0,
        radius: 40,
      })
      .animate(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);
      scene.addLayer(pointlayer);
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
      />
    );
  }
}
