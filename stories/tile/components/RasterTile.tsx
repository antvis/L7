import * as React from 'react';
import * as turf from '@turf/turf';
import { RasterLayer, Scene, LineLayer, ILayer, PointLayer } from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';

export default class RasterTile extends React.Component {
  private scene: Scene;

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    this.scene = new Scene({
      id: 'map',
      map: new Mapbox({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'normal',
        zoom: 4,
        viewMode: '3D',
      }),
    });

    // this.scene.on('mapchange', this.updateGridLayer);

    this.scene.on('loaded', () => {
      const point = new PointLayer({ zIndex: 2 })
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
        .active(true)
        .size(10);

      this.scene.addLayer(point);

      const layer = new RasterLayer({
        zIndex: -1,
      });
      layer
        .source(
          'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          // 'http://rd1yhmrzc.hn-bkt.clouddn.com/Mapnik/{z}/{x}/{y}.png',
          // 'https://api.maptiler.com/tiles/terrain-rgb/{z}/{x}/{y}.png?key=get_your_own_key_rSw2Lu595oi7U6WngsFQ',
          {
            parser: {
              type: 'rasterTile',
              tileSize: 256,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
            },
          },
        )
        .style({
          opacity: 0.5,
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
