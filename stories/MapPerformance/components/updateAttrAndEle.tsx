// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import { PointLayer } from '@antv/l7-layers';
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
        center: [120, 30],
        pitch: 0,
        zoom: 2,
      }),
    });

    const data1 = this.generateData(1000);
    const data2 = this.generateData(10000);

    const layer = new PointLayer()
      .source(data1, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .size(10)
      // .color('#f00')
      .color('c', (v) => v)
      // .shape('circle')
      .shape('simple')
      .active(true);

    scene.on('loaded', () => {
      scene.addLayer(layer);

      let data1cache = layer.createModelData(data1, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      });

      console.log(data1cache);

      let data2cache = layer.createModelData(data2, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      });

      let c = 0;
      setInterval(() => {
        if (c === 0) {
          c = 1;
          layer.updateModelData(data2cache);
          scene.render();
        } else {
          c = 0;
          layer.updateModelData(data1cache);
          scene.render();
        }
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
