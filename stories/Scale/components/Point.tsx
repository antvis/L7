import { PointLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';

export default class PointScale extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      pickBufferScale: 1.0,
      map: new GaodeMap({
        style: 'light',
        center: [-121.24357, 37.58264],
        pitch: 0,
        zoom: 6.45,
      }),
    });
    scene.on('loaded', () => {
      const data = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {
              type: 'C',
            },
            geometry: {
              type: 'Point',
              coordinates: [98.0859375, 39.36827914916014],
            },
          },
          {
            type: 'Feature',
            properties: {
              type: 'B',
            },
            geometry: {
              type: 'Point',
              coordinates: [124.1015625, 21.94304553343818],
            },
          },
          {
            type: 'Feature',
            properties: {
              type: 'A',
            },
            geometry: {
              type: 'Point',
              coordinates: [104.2437744140625, 21.453068633086783],
            },
          },
          {
            type: 'Feature',
            properties: {
              type: 'D',
            },
            geometry: {
              type: 'Point',
              coordinates: [102.3046875, 20.3034175184893],
            },
          },
        ],
      };
      const pointLayer = new PointLayer({
        autoFit: true,
      })
        .source(data)
        .shape('circle')
        .size(32)
        .scale({
          type: {
            type: 'cat',
            unknown: '#eee',
            domain: ['C', 'B', 'A'],
          },
        })
        .select({
          color: 'red',
        })
        .color('type', ['#fc8d59', '#ffffbf', '#99d594'])
        .style({
          opacity: 1,
          strokeWidth: 0,
          stroke: '#fff',
        });

      const pointName = new PointLayer({
        autoFit: true,
      })
        .source(data)
        .shape('type', 'text')
        .size(32)
        .color('#000')
        .style({
          opacity: 1,
          strokeWidth: 0,
          stroke: '#fff',
          textAnchor: 'center',
        });

      scene.addLayer(pointLayer);
      scene.addLayer(pointName);
      this.scene = scene;
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
      />
    );
  }
}
