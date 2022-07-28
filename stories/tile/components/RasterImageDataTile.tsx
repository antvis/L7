import * as React from 'react';
import * as turf from '@turf/turf';
import { RasterLayer, Scene, LineLayer, ILayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class OsmRasterTile extends React.Component {
  private scene: Scene;
  private gridLayer: ILayer;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new Map({
        center: [130, 30],
        pitch: 0,
        style: 'normal',
        zoom: 1.5,
      }),
    });

    // this.scene.on('mapchange', this.updateGridLayer);

    this.scene.on('loaded', () => {
      const layer = new RasterLayer({}).source(
        'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
        {
          parser: {
            type: 'rasterTile',
            tileSize: 256,

            zoomOffset: 0,
            updateStrategy: 'overlap',
          },
        },
      )
      .shape('dataImage')
      .style({
        clampLow: false,
        clampHigh: false,
        // opacity: 0.8,
        domain: [0, 8000],
        rampColors: {
          colors: [
            '#FF4818',
            '#F7B74A',
            '#FFF598',
            '#91EABC',
            '#2EA9A1',
            '#206C7C',
          ],
          positions: [0, 0.2, 0.4, 0.6, 0.8, 1.0],
        },
        // float value = u_pixelConstant + ((r * u_pixelConstantR + g * u_pixelConstantG + b * u_pixelConstantB) * u_pixelConstantRGB);
        pixelConstant: 0.0,
        pixelConstantR: 256 * 20,
        pixelConstantG: 256,
        pixelConstantB: 1,
        pixelConstantRGB: 1,
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
