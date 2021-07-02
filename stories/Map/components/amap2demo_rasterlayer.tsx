import { RasterLayer, Scene } from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
// tslint:disable-next-line:no-submodule-imports
// @ts-ignore
import * as GeoTIFF from 'geotiff';

export default class Amap2demo_rasterLayer extends React.Component {
  // @ts-ignore
  private scene: Scene;

  private async getTiffData() {
    const response = await fetch(
      'https://gw.alipayobjects.com/os/rmsportal/XKgkjjGaAzRyKupCBiYW.dat',
      // 'https://gw.alipayobjects.com/zos/antvdemo/assets/2019_clip/ndvi_201905.tiff',
    );
    const arrayBuffer = await response.arrayBuffer();
    const tiff = await GeoTIFF.fromArrayBuffer(arrayBuffer);
    const image = await tiff.getImage();
    const width = image.getWidth();
    const height = image.getHeight();
    const values = await image.readRasters();
    return {
      data: values[0],
      width,
      height,
      min: 0,
      max: 8000,
    };
  }

  public componentWillUnmount() {
    this.scene.destroy();
  }

  public async componentDidMount() {
    const scene = new Scene({
      id: 'map',
      map: new GaodeMap({
        center: [121.268, 30.3628],
        pitch: 0,
        style: 'dark',
        zoom: 2,
      }),
    });
    this.scene = scene;

    const tiffdata = await this.getTiffData();
    console.log('tiffdata', tiffdata);
    const layer = new RasterLayer({});
    const mindata = -0;
    const maxdata = 8000;
    layer
      .source(tiffdata.data, {
        parser: {
          type: 'raster',
          width: tiffdata.width,
          height: tiffdata.height,
          extent: [73.482190241, 3.82501784112, 135.106618732, 57.6300459963],
          // extent: [
          //   73.4766000000000048,
          //   18.1054999999999993,
          //   135.1066187,
          //   57.630046,
          // ],
        },
      })
      .style({
        opacity: 0.8,
        domain: [mindata, maxdata],
        clampLow: true,
        rampColors: {
          colors: [
            'rgb(166,97,26)',
            'rgb(223,194,125)',
            'rgb(245,245,245)',
            'rgb(128,205,193)',
            'rgb(1,133,113)',
          ],
          positions: [0, 0.25, 0.5, 0.75, 1.0],
        },
      });
    scene.addLayer(layer);
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
