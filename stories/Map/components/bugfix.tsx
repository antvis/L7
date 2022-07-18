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
      map: new Mapbox({
        // map: new GaodeMap({
        // map: new GaodeMapV2({
        // map: new Map({
        style: 'dark',
        center: [120, 30],
        zoom: 4,
      }),
    });

    this.scene = scene;

    const layer = new PointLayer({
      visible: false,
    })
      .source(
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
      )
      .shape('circle')
      .size(10)
      .color('#f00');

    scene.on('loaded', () => {
      scene.addLayer(layer);

      setTimeout(() => {
        layer.show();
        layer.style({
          opacity: 1,
        });

        console.log(layer.isVisible());
      }, 3000);
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
