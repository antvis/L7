// @ts-ignore
import { ImageTileLayer, Scene, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';
import * as React from 'react';

export default class Amap2demo_imageTileLayer extends React.Component {
  // @ts-ignore
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new Map({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 10,
        viewMode: '3D',
      }),
    });
    this.scene = scene;

    let originData = [
      {
        lng: 121.107846,
        lat: 30.267069,
      },
      {
        lng: 121.107,
        lat: 30.267069,
      },
      {
        lng: 121.107846,
        lat: 30.26718,
      },
    ];

    scene.on('loaded', () => {
      const layer = new ImageTileLayer();
      layer
        .source(
          'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          {
            parser: {
              type: 'imagetile',
            },
          },
        )
        .style({
          resolution: 'low', // low height
          // resolution: 'height'
          maxSourceZoom: 17,
        });

      let pointlayer = new PointLayer()
        .source(originData, {
          parser: {
            type: 'json',
            x: 'lng',
            y: 'lat',
          },
        })
        .shape('circle')
        .color('rgba(255, 0, 0, 1.0)')
        .size(10)
        .active(true);

      scene.addLayer(pointlayer);
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
        />
      </>
    );
  }
}
