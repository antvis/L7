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

  private updateGridLayer = () => {
    const bounds = this.scene['mapService'].getBounds();
    const bbox = [bounds[0][0], bounds[0][1], bounds[1][0], bounds[1][1]];
    // console.log('bbox: ', bbox);
    const poly = turf.bboxPolygon(bbox as [number, number, number, number]);
    const data = { type: 'FeatureCollection', features: [poly] };

    if (this.gridLayer) {
      this.gridLayer.setData(data);
      return;
    }
    this.gridLayer = new LineLayer({ autoFit: false, zIndex: 19 })
      .source(data)
      .size(2)
      .color('red')
      .shape('line');
    this.scene.addLayer(this.gridLayer);
  };

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
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
      const point = new PointLayer({ zIndex: 7 })
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
        .size(10);

      this.scene.addLayer(point);

      const layer = new RasterLayer({
        zIndex: 6,
        // minZoom: 1,
        // maxZoom: 16,
      });
      layer
        .source(
          'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          {
            parser: {
              type: 'rasterTile',
              tileSize: 256,
              // minZoom: 6,
              // maxZoom: 15,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
            },
          },
        )
        .style({
          // opacity: 0.5
        });

      this.scene.addLayer(layer);
      // this.updateGridLayer();
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
