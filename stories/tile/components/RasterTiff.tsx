import * as React from 'react';
import * as turf from '@turf/turf';
import {
  RasterLayer,
  Scene,
  LineLayer,
  ILayer,
  PointLayer,
  MaskLayer,
} from '@antv/l7';
import { GaodeMap, GaodeMapV2, Map, Mapbox } from '@antv/l7-maps';
// @ts-ignore
import * as GeoTIFF from 'geotiff';

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
        zoom: 2,
      }),
    });

    this.scene.on('loaded', () => {
     

      const layer = new RasterLayer();
      layer
        .source(
          // 'http://webst01.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
          // 'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/${z}/${y}/${x}.tif',
          'https://s2downloads.eox.at/demo/EOxCloudless/2019/rgb/{z}/{y}/{x}.tif',
          
          {
            parser: {
              type: 'rasterTiff',
              tileSize: 256,
              zoomOffset: 0,
              extent: [-180, -85.051129, 179, 85.051129],
              minZoom: 0,
              maxZoom: 0,
              rasterParser: async (data: any) => {
                const tiff = await GeoTIFF.fromArrayBuffer(data);
                const image = await tiff.getImage();
                const width = image.getWidth();
                const height = image.getHeight();
                const values = await image.readRasters();
                return { rasterData: values[0], width, height }
              }
            },
          },
        ).
        style({
          opacity: 0.8
        })

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
