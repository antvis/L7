// @ts-nocheck
import { Scene, PolygonLayer, PointLayer, Map } from '@antv/l7-mini';
// import { Scene } from '@antv/l7';
// import { PolygonLayer, PointLayer } from '@antv/l7-layers';
import { GaodeMap, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class ScaleComponent extends React.Component {
  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [120, 30],
        // center: [5000, 5000],
        pitch: 0,
        zoom: 1,
        // version: 'SIMPLE',
        // zoom: 13,
        // zoom: 10,
      }),
    });
    // scene.setBgColor('#000');
    const data = [
      // { x: 5000, y: 5000 },

      { lng: 120, lat: 30 },

      // { lng: 0, lat: 0 },
      // { lng: 0, lat: 85.05112 },
      // { lng: 0, lat: -85.05112 },

      // { lng: -90, lat: 0 },
      // { lng: -180, lat: 0 },
      // { lng: 90, lat: 0 },
      // { lng: 180, lat: 0 },

      // { lng: -90, lat: 85.05112 },
      // { lng: -180, lat: 85.05112 },
      // { lng: 90, lat: 85.05112 },
      // { lng: 180, lat: 85.05112 },

      // { lng: -90, lat: -85.05112 },
      // { lng: -180, lat: -85.05112 },
      // { lng: 90, lat: -85.05112 },
      // { lng: 180, lat: -85.05112 },
    ];
    const layer = new PointLayer()
      .source(data, {
        parser: {
          type: 'json',
          x: 'lng',
          y: 'lat',
        },
      })
      .shape('circle')
      .size(20)
      .color('#f00');

    scene.on('loaded', () => {
      scene.addLayer(layer);
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
