import { PointLayer, Marker, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
export default class Cluster extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    // this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110.19382669582967, 30.258134],
        pitch: 0,
        zoom: 3,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const pointLayer = new PointLayer({})
            .source(data, {
              cluster: true,
            })
            .shape('circle')
            .scale('point_count', {
              type: 'quantile',
            })
            .size('point_count', [5, 10, 15, 20, 25])
            .active(true)
            .color('yellow')
            .style({
              opacity: 0.5,
              strokeWidth: 1,
            });

          scene.addLayer(pointLayer);

          scene.on('zoomchange', () => {
            const d = pointLayer.getSource();
            // console.log('ddd', d.data.dataArray)
          });
        });
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
