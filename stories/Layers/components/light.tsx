import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
export default class Light extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      'https://alipay-rmsdeploy-image.cn-hangzhou.alipay.aliyun-inc.com/antvdemo/assets/city/bj.csv',
    );
    const pointsData = await response.text();

    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [116.405289, 39.904987],
        zoom: 6,
      }),
    });
    this.scene = scene;
    scene.on('loaded', async () => {
      const pointLayer = new PointLayer({
        blend: 'normal',
      })
        .source(pointsData, {
          parser: {
            type: 'csv',
            x: 'lng',
            y: 'lat',
          },
        })
        .size(1)
        .color('#ffa842')
        .style({
          opacity: 1,
        });

      scene.addLayer(pointLayer);
      this.scene = scene;
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
