// @ts-nocheck
import React from 'react';
import {
  Scene,
  GaodeMap,
  GaodeMapV2,
  Mapbox,
  Map,
  PointLayer,
  LineLayer,
} from '@antv/l7';

export default class Amap2demo extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        // center: [121.434765, 31.256735],
        // zoom: 14.83,
        pitch: 0,
        style: 'light',
        center: [120, 30],
        zoom: 4,
      }),
    });

    const data = {
      type: 'FeatureCollection',
      crs: {
        type: 'name',
        properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
      },
      features: [
        {
          type: 'Feature',
          properties: {
            id: 'ak16994521',
            mag: 2.3,
            time: 1507425650893,
            felt: null,
            tsunami: 0,
          },
          geometry: {
            type: 'Point',
            coordinates: [120, 30, 0.0],
          },
        },
      ],
    };
    const layer = new PointLayer()
      // .source(data)
      .source({
        type: 'FeatureCollection',
        crs: {
          type: 'name',
          properties: { name: 'urn:ogc:def:crs:OGC:1.3:CRS84' },
        },
        features: [
          {
            type: 'Feature',
            properties: {
              id: 'ak16994521',
              mag: 2.3,
              time: 1507425650893,
              felt: null,
              tsunami: 0,
            },
            geometry: {
              type: 'Point',
              coordinates: [125, 30, 0.0],
            },
          },
        ],
      })
      .shape('circle')
      .size(40)
      .color('#000');

    scene.on('loaded', () => {
      layer.setData(
        [
          {
            lng: 120,
            lat: 30,
          },
        ],
        {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        },
      );
      // layer.setData(data)

      scene.addLayer(layer);
    });
  }

  public render() {
    return (
      <>
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
      </>
    );
  }
}
