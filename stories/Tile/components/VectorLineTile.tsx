import * as React from 'react';
import * as turf from '@turf/turf';
import { RasterLayer, Scene, LineLayer, ILayer, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class RasterTile extends React.Component {
  private scene: Scene;
  private gridLayer: ILayer;

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
      }),
    });

    this.scene.on('loaded', () => {
      const point = new LineLayer({ zIndex: 7 })
        .source(
          // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          // 'http://localhost:3000/file.mbtiles/{z}/{x}/{y}.pbf',
          'https://a.tiles.mapbox.com/v4/mapbox.mapbox-streets-v6/{z}/{x}/{y}.vector.pbf?access_token=pk.eyJ1IjoiMTg5Njk5NDg2MTkiLCJhIjoiY2s5OXVzdHlzMDVneDNscDVjdzVmeXl0dyJ9.81SQ5qaJS0xExYLbDZAGpQ',
          {
            parser: {
              type: 'mvt',
              tileSize: 256,
              // minZoom: 6,
              // maxZoom: 15,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
            },
          },
        )
        .shape('line')
        .style({
          tileLayerName: ['path'],
        })
        .color('#f00')
        .size(10);

      this.scene.addLayer(point);
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
