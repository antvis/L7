import { PointLayer, Scene } from '@antv/l7';
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
        center: [110, 20],
        zoom: 5,
      }),
    });
    this.scene = scene;

    scene.addImage(
      '海南',
      'https://gw.alipayobjects.com/zos/basement_prod/30580bc9-506f-4438-8c1a-744e082054ec.svg',
    );

    scene.on('loaded', () => {
      const imageLayer = new PointLayer({ layerType: 'fillImage' })
        .source(
          [
            {
              lng: 110.4819,
              lat: 19.2089,
              s: '海南',
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
        .shape('s', (s) => s)
        .size(60)
        .active({
          color: '#f00',
          mix: 0.5,
        })
        .style({
          rotation: 90,
        });

      scene.addLayer(imageLayer);

      setTimeout(() => {
        imageLayer.setData([
          {
            lng: 110.5,
            lat: 19.2089,
            s: '海南',
          },
        ]);
      }, 1000);
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
