// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { HeatmapLayer, LineLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [116.49114, 39.866973],
        zoom: 10,
      }),
    });

    scene.on('loaded', () => {
      let heatData1 = [{ lat: 39.866973, lng: 116.49114, count: 48 }];
      let heatData2 = [
        { lat: 39.866973, lng: 116.49114, count: 48 },
        { lat: 39.87, lng: 116.45, count: 48 },
      ];

      const parser = {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      };
      const heatmaplayer = new HeatmapLayer()
        .source(heatData1, parser)
        .size('count', [0, 1])
        .shape('heatmap')
        .style({
          intensity: 10,
          radius: 20,
          opacity: 1.0,
          rampColors: {
            colors: [
              '#2E8AE6',
              '#69D1AB',
              '#DAF291',
              '#FFD591',
              '#FF7A45',
              '#CF1D49',
            ],
            positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
          },
        });
      scene.addLayer(heatmaplayer);
      // console.log(heatmaplayer)
      let modelData = heatmaplayer.createModelData(heatData2, parser);
      setTimeout(() => {
        heatmaplayer.updateModelData(modelData);
        scene.render();
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
      ></div>
    );
  }
}
