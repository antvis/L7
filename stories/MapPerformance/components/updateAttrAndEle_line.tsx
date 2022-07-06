// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer, LineLayer } from '@antv/l7-layers';
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

    // const data1 = this.generateData(1000);
    // const data2 = this.generateData(10000);
    const data1 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          properties: {
            c: '#f00',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [100.37109375, 32.32427558887655],
              [101.689453125, 28.844673680771795],
              [104.853515625, 30.524413269923986],
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
            c: '#ff0',
          },
          geometry: {
            type: 'LineString',
            coordinates: [
              [109.6875, 39.90973623453719],
              [115.75195312499999, 39.90973623453719],
              [109.3359375, 37.579412513438385],
              [115.57617187499999, 36.80928470205937],
            ],
          },
        },
      ],
    };

    const layer = new LineLayer()
      .source(data1)
      .size(2)
      .color('c', (v) => v)
      .shape('line')
      .active(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);

      // let data1cache = layer.createModelData(data1, {});

      // console.log(data1cache);

      // let data2cache = layer.createModelData(data2, {});
      // console.log('data2cache', data2cache)

      // let c = 0;
      // setInterval(() => {
      //   if (c === 0) {
      //     c = 1;
      // layer.updateModelData(data2cache);
      // scene.render();
      //   } else {
      //     c = 0;
      //     layer.updateModelData(data1cache);
      //     scene.render();
      //   }
      // }, 1000);

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
