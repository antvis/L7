// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, LineLayer, PolygonLayer } from '@antv/l7-layers';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class Demo extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public generateData(size) {
    let data = [];
    for (let i = 0; i < size; i++) {
      data.push({
        lng: Math.random() * 180,
        lat: Math.random() * 80 - 40,
        c: Math.random() > 0.5 ? '#f00' : '#ff0',
      });
    }
    return data;
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [110, 30],
        pitch: 0,
        zoom: 4,
      }),
    });

    const data1 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [
              [
                [98.4375, 35.746512259918504],
                [98.173828125, 30.14512718337613],
                [104.94140625, 30.600093873550072],
                [98.4375, 35.746512259918504],
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
                [110.390625, 38.06539235133249],
                [106.435546875, 33.50475906922609],
                [112.763671875, 32.47269502206151],
                [109.072265625, 27.21555620902969],
                [117.24609374999999, 27.605670826465445],
                [118.037109375, 30.372875188118016],
                [115.927734375, 34.30714385628804],
                [111.97265625, 36.87962060502676],
                [110.390625, 38.06539235133249],
              ],
            ],
          },
        },
      ],
    };

    const layer = new PolygonLayer()
      .source(data1)
      .size(2)
      .color('#f00')
      .shape('fill')
      .active(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);

      setTimeout(() => {
        let data2cache = layer.createModelData(data2);
        layer.updateModelData(data2cache);
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
