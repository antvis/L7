import { PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_polygon extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 40,
        center: [120, 30],
        zoom: 13,
      }),
    });
    this.scene = scene;
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [113.8623046875, 30.031055426540206],
                [116.3232421875, 30.031055426540206],
                [116.3232421875, 31.090574094954192],
                [113.8623046875, 31.090574094954192],
                [113.8623046875, 30.031055426540206],
              ],
            ],
          },
        },
      ],
    };

    const data2 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            testOpacity: 0.8,
          },
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [113.8623046875 + 1, 30.031055426540206],
                [116.3232421875 + 1, 30.031055426540206],
                [116.3232421875 + 1, 31.090574094954192],
                [113.8623046875 + 1, 31.090574094954192],
                [113.8623046875 + 1, 30.031055426540206],
              ],
            ],
          },
        },
      ],
    };

    const layer = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .shape('fill')
      .color('red')
      .active(true)
      .style({
        // opacityLinear: {
        //   enable: true,
        //   dir: 'in',
        // },
      });
    scene.addLayer(layer);

    const layer2 = new PolygonLayer({
      autoFit: true,
    })
      .source(data2)
      .shape('fill')
      .color('#ff0')
      .active(true)
      .style({
        // opacity: 0.4,
        // opacityLinear: {
        //   enable: true,
        //   dir: 'out',
        // },
        // raisingHeight: 50000,
      });
    scene.addLayer(layer2);
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
