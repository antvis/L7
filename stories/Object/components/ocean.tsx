import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_polygon extends React.Component {
  private scene: Scene;
  public componentWillUnmount() {
    this.scene.destroy();
  }
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        center: [-44.40673828125, -18.375379094031825],
        zoom: 13,
      }),
    });
    this.scene = scene;

    fetch(
      'https://gw.alipayobjects.com/os/bmw-prod/67130c6c-7f49-4680-915c-54e69730861d.json',
    )
      .then((data) => data.json())
      .then(({ lakeData }) => {
        const lakeLayer = new PolygonLayer({ autoFit: true })
          .source(lakeData)
          .shape('ocean')
          .color('#f00')
          .style({
            watercolor: '#6D99A8',
            // watercolor: '#0f0',
          })
          .animate(true);

        scene.addLayer(lakeLayer);
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
