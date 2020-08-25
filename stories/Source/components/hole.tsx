import { LineLayer, PolygonLayer, Scene } from '@antv/l7';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

function convertRGB2Hex(rgb: number[]) {
  return (
    '#' + rgb.map((r) => ('0' + Math.floor(r).toString(16)).slice(-2)).join('')
  );
}

export default class MultiPolygon extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const response = await fetch(
      // 'https://gw.alipayobjects.com/os/basement_prod/f79485d8-d86f-4bb3-856d-537b586be06e.json',
      'https://gw.alipayobjects.com/os/basement_prod/619a6f16-ecb0-4fca-9f9a-b06b67f6f02b.json',
    );
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [-44.40673828125, -18.375379094031825],
        zoom: 12,
      }),
    });
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [110.5224609375, 32.731840896865684],
                  [113.0712890625, 32.731840896865684],
                  [113.0712890625, 34.56085936708384],
                  [110.5224609375, 34.56085936708384],
                  [110.5224609375, 32.731840896865684],
                ],
                [
                  [111.26953125, 33.52307880890422],
                  [111.26953125, 34.03445260967645],
                  [112.03857421875, 34.03445260967645],
                  [112.03857421875, 33.52307880890422],
                  [111.26953125, 33.52307880890422],
                ],
              ],
              [
                [
                  [115.04882812499999, 34.379712580462204],
                  [114.9609375, 33.46810795527896],
                  [115.8837890625, 33.50475906922609],
                  [115.86181640625001, 34.379712580462204],
                  [115.04882812499999, 34.379712580462204],
                ],
              ],
            ],
          },
        },
        {
          type: 'Feature',
          properties: {},
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
              [
                [117.26806640625, 32.13840869677249],
                [118.36669921875, 32.13840869677249],
                [118.36669921875, 32.47269502206151],
                [117.26806640625, 32.47269502206151],
                [117.26806640625, 32.13840869677249],
              ],
            ],
          },
        },
      ],
    };
    // console.log(data.features[5]);
    // data.features = data.features.slice(6);
    const layer = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .shape('fill')
      .color('red')
      .style({
        opacity: 1.0,
      });
    const layer2 = new PolygonLayer({
      autoFit: true,
    })
      .source(data)
      .shape('line')
      .color('#fff')
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
    scene.addLayer(layer2);
    console.log(layer);
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
