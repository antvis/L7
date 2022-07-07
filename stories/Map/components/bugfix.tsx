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
        // style: 'blank',
        center: [120, 30],
        zoom: 15,
      }),
    });

    this.scene = scene;

    scene.on('loaded', () => {
      const layer = new PointLayer()
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
        .color('#f00')
        .size(150)
        .style({
          unit: 'meter',
        });
      // setTimeout(() => {
      //   layer.style({
      //     opacity: 0.5,
      //     unit: ''
      //   })
      //   scene.render()
      // }, 2000)
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
