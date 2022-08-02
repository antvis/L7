// @ts-nocheck
// @ts-ignore
import { Scene, Source } from '@antv/l7';
import { HeatmapLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [120, 30],
        pitch: 0,
        zoom: 2,
      }),
    });

    scene.on('loaded', () => {
      fetch(
        'https://gw.alipayobjects.com/os/basement_prod/d3564b06-670f-46ea-8edb-842f7010a7c6.json',
      )
        .then((res) => res.json())
        .then((data) => {
          const layer = new HeatmapLayer({})
            .source(data)
            .shape('heatmap')
            .size('mag', [0, 1.0]) // weight映射通道
            .style({
              intensity: 2,
              radius: 20,
              opacity: 1.0,
              rampColors: {
                colors: [
                  '#FF4818',
                  '#F7B74A',
                  '#FFF598',
                  '#F27DEB',
                  '#8C1EB2',
                  '#421EB2',
                ].reverse(),
                positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
              },
            });
          scene.addLayer(layer);
        });
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
