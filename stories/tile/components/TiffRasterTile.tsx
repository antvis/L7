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
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 3,
        viewMode: '3D',
      }),
    });

    this.scene.on('loaded', () => {
      const layer = new RasterLayer({
        zIndex: 9,
      });
      layer.source('https://a.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        parser: {
          type: 'rasterTile',
          tileSize: 256,
          minZoom: 0,
          maxZoom: 19,
          zoomOffset: 0,
          updateStrategy: 'overlap',
          // extent: [-180, -85.051129, 175, 85.051129],
        },
      });
      // layer.on('tiles-loaded', (tiles) => {
      //   console.log('tiles-loaded', tiles.length);
      // });

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
