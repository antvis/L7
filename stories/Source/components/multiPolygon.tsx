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
        center: [118.70796203613281, 31.84956532831343],
        zoom: 12,
      }),
    });
    const data = await response.json();
    // console.log(data.features[5]);
    // data.features = data.features.slice(6);
    const layer = new PolygonLayer()
      .source({
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Polygon',
              coordinates: [
                [
                  [118.70796203613281, 31.84956532831343],
                  [118.67019653320312, 31.783049527817784],
                  [118.70384216308594, 31.757947795369688],
                  [118.7944793701172, 31.79647323968844],
                  [118.78829956054686, 31.85073184447357],
                  [118.70796203613281, 31.84956532831343],
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
                  [116.96044921875, 29.38217507514529],
                  [114.41162109375, 30.315987718557867],
                  [114.78515624999999, 28.43971381702788],
                  [114.93896484374999, 27.0982539061379],
                  [116.98242187499999, 27.01998400798257],
                  [119.20166015625, 28.091366281406945],
                  [119.17968749999999, 29.38217507514529],
                  [116.96044921875, 29.38217507514529],
                ],
              ],
            },
          },
        ],
      })
      .shape('extrude')
      .size(10)
      .color('red')
      .style({
        opacity: 1.0,
      });
    scene.addLayer(layer);
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
