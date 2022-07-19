// @ts-nocheck
import React from 'react';
import {
  Scene,
  GaodeMap,
  GaodeMapV2,
  Mapbox,
  Map,
  PointLayer,
  Marker,
  MarkerLayer,
  Popup,
  HeatmapLayer,
  LineLayer,
  Source,
} from '@antv/l7';

export default class Amap2demo extends React.Component {
  public async componentDidMount() {
    const source = new Source(
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

    let c = 0,
      scene,
      layer;
    scene = new Scene({
      id: 'map',
      // map: new Mapbox({
      // map: new GaodeMap({
      map: new GaodeMapV2({
        // map: new Map({
        style: 'dark',
        center: [120, 30],
        zoom: 4,
      }),
    });

    const layer = new PointLayer()
      .source(source)
      .shape('circle')
      .size(10)
      .color('#f00');

    scene.on('loaded', () => {
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
