import {
  LineLayer,
  Scene,
  MaskLayer,
  RasterLayer,
} from '@antv/l7';
import { GaodeMap } from '@antv/l7-maps';
import * as React from 'react';
// @ts-ignore
import * as GeoTIFF from 'geotiff';

export default class MaskPoints extends React.Component {
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
      stencil: true,
      map: new GaodeMap({
        center: [120.165, 30.26],
        pitch: 0,
        zoom: 2,
        style: 'dark',
      }),
    });
    this.scene = scene;
    scene.addImage(
      '00',
      'https://gw.alipayobjects.com/zos/basement_prod/604b5e7f-309e-40db-b95b-4fac746c5153.svg',
    );
    const data = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [125.15625000000001, 8.407168163601076],
                  [116.54296874999999, -21.289374355860424],
                  [156.26953125, -20.632784250388013],
                  [150.29296875, 2.1088986592431382],
                ],
              ],
              [
                [
                  [78.57421875, 46.92025531537451],
                  [51.67968749999999, 37.020098201368114],
                  [87.890625, 28.76765910569123],
                ],
              ],
            ],
          },
        },
      ],
    };

    const data2 = {
      type: 'FeatureCollection',
      features: [
        {
          type: 'Feature',
          geometry: {
            type: 'MultiPolygon',
            coordinates: [
              [
                [
                  [133.2421875, 44.33956524809713],
                  [123.04687499999999, 31.50362930577303],
                  [154.3359375, 20.632784250388028],
                  [157.32421875, 38.54816542304656],
                ],
              ],
            ],
          },
        },
      ],
    };

    scene.on('loaded', () => {
      const polygonlayer = new MaskLayer({})
        .source(data)
        .shape('fill')
        .color('red')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer);

      const polygonlayer2 = new MaskLayer({})
        .source(data2)
        .shape('fill')
        .color('#ff0')
        .style({
          opacity: 0.3,
        });
      scene.addLayer(polygonlayer2);
    });

    const tiffdata = await this.getTiffData();
    // const layer = new RasterLayer({ mask: true });
    const layer = new RasterLayer({ mask: true, maskInside: false });
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
