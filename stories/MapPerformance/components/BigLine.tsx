// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, LineLayer } from '@antv/l7-layers';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class PointTest extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 5,
      }),
    });
    // scene.diasbleShaderPick();
    // let address =
    //   'https://gw.alipayobjects.com/os/bmw-prod/3f2f9284-3fb1-4838-8baa-6ffd06738fcd.csv'; // 8w
    // https://gw.alipayobjects.com/os/bmw-prod/b1dea29e-63b8-403f-804c-a08e1f85fd4e.csv // 30 w
    // https://gw.alipayobjects.com/os/bmw-prod/e465b87a-925a-48b4-9fb3-0952bb0b53c2.csv // 20 w
    let address =
      'https://gw.alipayobjects.com/os/bmw-prod/28fc7ade-8cb5-4776-a41c-470bf18c48a1.csv'; // 40 w
    fetch(address)
      .then((res) => res.text())
      .then((data) => {
        const lineLayer = new LineLayer({
          // autoFit: true,
          blend: 'normal',
        })
          .source(data, {
            parser: {
              type: 'csv',
              x: 'f_lon',
              y: 'f_lat',
              x1: 't_lon',
              y1: 't_lat',
            },
          })
          // .shape('arcmini')
          // .shape('arc')
          // .shape('line')
          .shape('simple')
          .size(2)
          .color('rgb(13,64,140)')
          .active({
            color: '#ff0',
          })
          .style({
            segmentNumber: 30,
          });

        scene.addLayer(lineLayer);
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
