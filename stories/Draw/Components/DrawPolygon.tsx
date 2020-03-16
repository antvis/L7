import { LineLayer, PointLayer, PolygonLayer, Scene } from '@antv/l7';
import { Mapbox, GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

function convertRGB2Hex(rgb: number[]) {
  return (
    '#' + rgb.map((r) => ('0' + Math.floor(r).toString(16)).slice(-2)).join('')
  );
}
function calcMid(data1: number[], data2: number[]) {
  return {
    x: (data1[0] + data2[0]) / 2,
    y: (data1[1] + data2[1]) / 2,
  };
}
export default class MultiPolygon extends React.Component {
  private gui: dat.GUI;
  private $stats: Node;
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [108.6328125, 40.17887331434696],
                [92.28515625, 37.3002752813443],
                [99.31640625, 25.799891182088334],
                [111.26953125, 23.885837699862005],
                [115.83984375, 36.87962060502676],
                [108.6328125, 40.17887331434696],
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
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [117.59765625, 45.9511496866914],
                [120.76171875, 35.60371874069731],
                [129.0234375, 30.90222470517144],
                [135.703125, 37.43997405227057],
                [135.703125, 45.9511496866914],
                [117.59765625, 45.9511496866914],
              ],
            ],
          },
        },
      ],
    };
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        pitch: 0,
        style: 'dark',
        center: [121.775374, 31.31067],
        zoom: 2,
      }),
    });
    const layer = new PolygonLayer()
      .source(data)
      .shape('fill')
      .color('#3bb2d0')
      .style({
        opacity: 0.1,
      });
    const line = new PolygonLayer()
      .source(data)
      .shape('line')
      .size(1)
      .color('#3bb2d0')
      .style({
        opacity: 1,
      });
    scene.addLayer(layer);
    scene.addLayer(line);

    const activelayer = new PolygonLayer()
      .source(data2)
      .shape('fill')
      .color('#fbb03b')
      .style({
        opacity: 0.1,
      });
    const activeline = new PolygonLayer()
      .source(data2)
      .shape('line')
      .size(1)
      .color('#fbb03b')
      .style({
        opacity: 1,
        lineType: 'dash',
        dashArray: [2, 2],
      });
    scene.addLayer(activelayer);
    scene.addLayer(activeline);
    scene.addLayer(this.addPoint(data2));
    scene.addLayer(this.addActivePoint());
    scene.addLayer(this.addMidPoint(data2));
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
  private addPoint(data: any) {
    const pointData = data.features[0].geometry.coordinates[0].map(
      (coor: any) => {
        return {
          x: coor[0],
          y: coor[1],
        };
      },
    );
    return new PointLayer()
      .source(pointData, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('circle')
      .color('#fbb03b')
      .size(3)
      .style({
        stroke: '#fff',
        strokeWidth: 2,
      });
  }

  private addMidPoint(data: any) {
    const coords = data.features[0].geometry.coordinates[0];
    const midPoint = [];
    for (let i = 0; i < coords.length - 1; i++) {
      midPoint.push(calcMid(coords[i], coords[i + 1]));
    }
    return new PointLayer()
      .source(midPoint, {
        parser: {
          type: 'json',
          x: 'x',
          y: 'y',
        },
      })
      .shape('circle')
      .color('#fbb03b')
      .size(2);
  }
  private addActivePoint() {
    return new PointLayer()
      .source(
        [
          {
            x: 117.59765625,
            y: 45.9511496866914,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'x',
            y: 'y',
          },
        },
      )
      .shape('circle')
      .color('#fbb03b')
      .size(5)
      .style({
        stroke: '#fff',
        strokeWidth: 2,
      });
  }
}
