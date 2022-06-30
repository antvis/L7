import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  PolygonLayer,
  Source,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class QuXian extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      stencil: true,
      // map: new GaodeMap({
      map: new Mapbox({
        // center: [121.268, 30.3628],
        // center: [122.76391708791607, 43.343389123718815],
        // center: [120, 30],
        // style: 'normal',
        // zoom: 6,
        // zooms: [0, 25],
        // maxZoom: 25,
        center: [120, 30],
        style: 'blank',
        zoom: 2,
        // zoom: 13,
        // center: [-122.447303, 37.753574],
      }),
    });

    this.scene.on('loaded', () => {
      const tileSource = new Source(
        'http://localhost:3000/district.mbtiles/{z}/{x}/{y}.pbf',
        {
          parser: {
            type: 'mvt',
            tileSize: 256,
            zoomOffset: -1,
            maxZoom: 7,
          },
        },
      );
      const layer = new PolygonLayer({
        featureId: 'adcode',
        sourceLayer: 'district',
      });
      layer
        .source(tileSource)
        .shape('fill')
        .color('blue')
        .style({
          opacity: 0.6,
        });

      layer.on('click', () => {
        console.log(this.scene.getZoom());
      });

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
