// @ts-nocheck
// @ts-ignore
import { Scene } from '@antv/l7';
import {
  PointLayer,
  LineLayer,
  PolygonLayer,
  GeometryLayer,
} from '@antv/l7-layers';
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
        pitch: 60,
        center: [120.1025, 30.2594],
        rotation: 160,
        zoom: 14,
      }),
    });

    const layer = new GeometryLayer()
      .style({
        width: 0.074,
        height: 0.061,
        center: [120.1025, 30.2594],
        widthSegments: 100,
        heightSegments: 100,
        // widthSegments: 10,
        // heightSegments: 10,
        mapTexture:
          'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*gA0NRbuOF5cAAAAAAAAAAAAAARQnAQ',
        terrainTexture:
          'https://gw.alipayobjects.com/mdn/rms_23a451/afts/img/A*eYFaRYlnnOUAAAAAAAAAAAAAARQnAQ',
        rgb2height: (r: number, g: number, b: number) => {
          let h =
            -10000.0 +
            (r * 255.0 * 256.0 * 256.0 + g * 255.0 * 256.0 + b * 255.0) * 0.1;
          h = h / 20 - 127600;
          h = Math.max(0, h);
          return h;
        },
      })
      .color('#f00');

    scene.on('loaded', () => {
      scene.addLayer(layer);

      let cache10 = null,
        cache100 = null;

      layer.on('terrainImageLoaded', () => {
        console.log('terrainImageLoaded');

        cache10 = layer.createModelData([], {
          widthSegments: 10,
          heightSegments: 10,
        });

        cache100 = layer.createModelData([], {
          widthSegments: 100,
          heightSegments: 100,
        });
      });

      let currentCache = 'cache100';
      scene.on('zoom', ({ value }) => {
        if (!cache10 || !cache100) return;
        if (value < 14.5) {
          if (currentCache !== 'cache10') {
            console.log('set cache10');
            layer.updateModelData(cache10);
            currentCache = 'cache10';
          }
        } else {
          if (currentCache !== 'cache100') {
            console.log('set cache100');
            layer.updateModelData(cache100);
            currentCache = 'cache100';
          }
        }
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
