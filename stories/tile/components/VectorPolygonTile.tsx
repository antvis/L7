import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 5,
        viewMode: '3D',
      }),
    });

    // this.scene.on('mapchange', this.updateGridLayer);

    this.scene.on('loaded', () => {
      // const point = new PointLayer({ zIndex: 7 })
      //   .source(
      //     [
      //       {
      //         lng: 120,
      //         lat: 30,
      //       },
      //     ],
      //     {
      //       parser: {
      //         type: 'json',
      //         x: 'lng',
      //         y: 'lat',
      //       },
      //     },
      //   )
      //   .shape('circle')
      //   .color('#ff0')
      //   .active(true)
      //   .size(10);

      // this.scene.addLayer(point);

      const layer = new PolygonLayer({
        zIndex: -1,
      });
      layer
        .source(
          // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          'http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf',
          {
            parser: {
              type: 'mvt',
              tileSize: 256,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
            },
          },
        )
        .style({
          opacity: 0.4,
        })
        .active(true);

      this.scene.addLayer(layer);
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
